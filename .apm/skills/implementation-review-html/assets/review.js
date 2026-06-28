'use strict';
(function () {
  // 設定はビルド時に template の window.REVIEW_CONFIG として注入される（build.mjs 参照）。
  // 直接 review.js を開いた場合のフォールバックも持たせる。
  var CFG = (typeof window !== 'undefined' && window.REVIEW_CONFIG) || {};
  var STORE_KEY = CFG.storeKey || 'review-comments';
  var CATEGORIES = CFG.categories || ['バグ', '設計', 'デザイン', '文言', '提案'];
  var PRIORITIES = CFG.priorities || ['高', '中', '低'];

  var doc = document.getElementById('doc');
  var list = document.getElementById('list');
  var floatBtn = document.getElementById('floatBtn');
  var countEl = document.getElementById('count');

  var comments = load();
  var pendingRange = null;
  var activeCid = null;

  // ── images ──────────────────────────────
  Array.prototype.forEach.call(doc.querySelectorAll('img.shot'), function (img) {
    var key = img.getAttribute('data-img');
    if (window.IMAGES && window.IMAGES[key]) img.src = window.IMAGES[key];
    else { img.alt = (img.alt || '') + '（画像未取得）'; img.style.minHeight = '120px'; img.style.background = '#eee'; }
  });

  // ── persistence ─────────────────────────
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(comments)); } catch (e) {}
  }
  function uid() {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ── anchoring helpers ───────────────────
  function nearestAnchor(node) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    while (el && el !== doc) {
      if (el.id) return el;
      el = el.parentNode;
    }
    return doc;
  }
  function sectionTitle(el) {
    if (el.getAttribute && el.getAttribute('data-title')) return el.getAttribute('data-title');
    var h = el.querySelector && el.querySelector('h2,h3');
    return h ? h.textContent.trim() : (el.id || '');
  }
  function occurrenceBefore(anchorEl, quote, range) {
    var pre = document.createRange();
    pre.selectNodeContents(anchorEl);
    try { pre.setEnd(range.startContainer, range.startOffset); } catch (e) { return 0; }
    var before = pre.toString();
    var n = 0, from = 0, idx;
    while ((idx = before.indexOf(quote, from)) !== -1) { n++; from = idx + 1; }
    return n;
  }
  // build a Range covering [start,end) char offsets within el's text
  function rangeFromOffsets(el, start, end) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    var pos = 0, sNode = null, sOff = 0, eNode = null, eOff = 0, node;
    while ((node = walker.nextNode())) {
      var len = node.nodeValue.length;
      if (!sNode && start <= pos + len) { sNode = node; sOff = start - pos; }
      if (!eNode && end <= pos + len) { eNode = node; eOff = end - pos; break; }
      pos += len;
    }
    if (!sNode || !eNode) return null;
    var r = document.createRange();
    r.setStart(sNode, sOff);
    r.setEnd(eNode, eOff);
    return r;
  }

  // ── highlight wrapping ──────────────────
  function wrapRange(range, cid) {
    if (range.collapsed) return;
    var startNode = range.startContainer, startOff = range.startOffset;
    var endNode = range.endContainer, endOff = range.endOffset;
    var textNodes = [];
    var walker = document.createTreeWalker(
      range.commonAncestorContainer.nodeType === 3
        ? range.commonAncestorContainer.parentNode
        : range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      { acceptNode: function (n) { return range.intersectsNode(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } },
      false
    );
    var n;
    while ((n = walker.nextNode())) textNodes.push(n);
    textNodes.forEach(function (tn) {
      var s = 0, e = tn.nodeValue.length;
      if (tn === startNode) s = startOff;
      if (tn === endNode) e = endOff;
      if (s >= e) return;
      var target = tn;
      if (s > 0) target = tn.splitText(s);
      if (e - s < target.nodeValue.length) target.splitText(e - s);
      var mark = document.createElement('mark');
      mark.className = 'cmt';
      mark.setAttribute('data-cid', cid);
      target.parentNode.replaceChild(mark, target);
      mark.appendChild(target);
      mark.addEventListener('click', function (ev) { ev.stopPropagation(); focusComment(cid); });
    });
  }
  function marksFor(cid) { return doc.querySelectorAll('mark.cmt[data-cid="' + cid + '"]'); }
  // 選択が mermaid 図（描画後は SVG）の内側かどうか。図の中はコメント対象にしない。
  function inMermaid(node) {
    var el = node && node.nodeType === 1 ? node : node && node.parentNode;
    while (el && el !== doc) {
      if (el.classList && el.classList.contains('mermaid')) return true;
      el = el.parentNode;
    }
    return false;
  }

  // ── float button ────────────────────────
  function showFloat(rect) {
    floatBtn.style.display = 'block';
    var top = rect.bottom + window.scrollY + 6;
    var left = rect.left + window.scrollX;
    floatBtn.style.top = top + 'px';
    floatBtn.style.left = Math.max(8, left) + 'px';
  }
  function hideFloat() { floatBtn.style.display = 'none'; }

  doc.addEventListener('mouseup', function () {
    setTimeout(function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { hideFloat(); return; }
      var range = sel.getRangeAt(0);
      if (!doc.contains(range.commonAncestorContainer)) { hideFloat(); return; }
      if (inMermaid(range.commonAncestorContainer)) { hideFloat(); return; }
      var text = sel.toString();
      if (!text.trim()) { hideFloat(); return; }
      pendingRange = range.cloneRange();
      showFloat(range.getBoundingClientRect());
    }, 0);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideFloat(); });

  floatBtn.addEventListener('click', function () {
    if (!pendingRange) return;
    var anchorEl = nearestAnchor(pendingRange.commonAncestorContainer);
    var quote = pendingRange.toString();
    var occ = occurrenceBefore(anchorEl, quote, pendingRange);
    var cid = uid();
    wrapRange(pendingRange, cid);
    comments.push({
      id: cid,
      section: sectionTitle(anchorEl),
      anchorId: anchorEl.id || '',
      quote: quote,
      occurrence: occ,
      category: '提案',
      priority: '中',
      comment: '',
      createdAt: new Date().toISOString()
    });
    save();
    renderPanel();
    hideFloat();
    var sel = window.getSelection(); if (sel) sel.removeAllRanges();
    pendingRange = null;
    focusComment(cid, true);
  });

  // ── panel ───────────────────────────────
  function setActive(cid) {
    activeCid = cid;
    Array.prototype.forEach.call(doc.querySelectorAll('mark.cmt.active'), function (m) { m.classList.remove('active'); });
    Array.prototype.forEach.call(list.querySelectorAll('.cmt-card.active'), function (c) { c.classList.remove('active'); });
    if (!cid) return;
    Array.prototype.forEach.call(marksFor(cid), function (m) { m.classList.add('active'); });
    var card = list.querySelector('.cmt-card[data-cid="' + cid + '"]');
    if (card) card.classList.add('active');
  }
  function focusComment(cid, focusInput) {
    renderPanel();
    setActive(cid);
    var card = list.querySelector('.cmt-card[data-cid="' + cid + '"]');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (focusInput) { var ta = card.querySelector('textarea'); if (ta) ta.focus(); }
    }
  }
  function scrollToMark(cid) {
    var m = marksFor(cid)[0];
    if (m) { m.scrollIntoView({ behavior: 'smooth', block: 'center' }); setActive(cid); }
  }
  function opt(values, sel) {
    return values.map(function (v) { return '<option' + (v === sel ? ' selected' : '') + '>' + v + '</option>'; }).join('');
  }
  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderPanel() {
    countEl.textContent = comments.length + ' 件';
    if (comments.length === 0) {
      list.innerHTML = '<div class="empty">まだコメントはありません。<br>本文のテキストを選択して追加してください。</div>';
      return;
    }
    list.innerHTML = comments.map(function (c) {
      return '<div class="cmt-card" data-cid="' + c.id + '">' +
        '<div class="sec">' + esc(c.section) + '</div>' +
        '<div class="quote" data-jump="' + c.id + '">' + esc(c.quote) + '</div>' +
        '<div class="row">' +
        '<select data-f="category">' + opt(CATEGORIES, c.category) + '</select>' +
        '<select data-f="priority" class="pri-' + c.priority + '">' + opt(PRIORITIES, c.priority) + '</select>' +
        '</div>' +
        '<textarea placeholder="コメントを入力…">' + esc(c.comment) + '</textarea>' +
        '<div class="foot"><span class="help">優先度 ' + c.priority + '</span>' +
        '<button class="del" data-del="' + c.id + '">削除</button></div>' +
        '</div>';
    }).join('');
    if (activeCid) setActive(activeCid);
  }

  list.addEventListener('input', function (e) {
    var card = e.target.closest('.cmt-card'); if (!card) return;
    var cid = card.getAttribute('data-cid');
    var c = comments.find(function (x) { return x.id === cid; }); if (!c) return;
    if (e.target.tagName === 'TEXTAREA') c.comment = e.target.value;
    else if (e.target.getAttribute('data-f') === 'category') c.category = e.target.value;
    else if (e.target.getAttribute('data-f') === 'priority') {
      c.priority = e.target.value; e.target.className = 'pri-' + c.priority;
      card.querySelector('.foot .help').textContent = '優先度 ' + c.priority;
    }
    save();
  });
  list.addEventListener('click', function (e) {
    var jump = e.target.getAttribute('data-jump');
    if (jump) { scrollToMark(jump); return; }
    var del = e.target.getAttribute('data-del');
    if (del) {
      comments = comments.filter(function (x) { return x.id !== del; });
      Array.prototype.forEach.call(marksFor(del), function (m) {
        var parent = m.parentNode;
        while (m.firstChild) parent.insertBefore(m.firstChild, m);
        parent.removeChild(m); parent.normalize();
      });
      save(); renderPanel();
      return;
    }
    var card = e.target.closest('.cmt-card');
    if (card) setActive(card.getAttribute('data-cid'));
  });

  // ── toolbar: submit / import / clear ────
  document.getElementById('submitBtn').addEventListener('click', function () {
    var payload = {
      project: CFG.project || (typeof document !== 'undefined' && document.title) || 'implementation review',
      generatedAt: new Date().toISOString(),
      source: 'review/index.html',
      count: comments.length,
      comments: comments.map(function (c) {
        return { id: c.id, section: c.section, anchorId: c.anchorId, quote: c.quote, category: c.category, priority: c.priority, comment: c.comment, createdAt: c.createdAt };
      })
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'review-comments.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 0);
  });
  document.getElementById('importBtn').addEventListener('click', function () {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', function (e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var arr = Array.isArray(data) ? data : data.comments;
        if (!Array.isArray(arr)) throw new Error('comments 配列がありません');
        clearHighlights();
        comments = arr;
        save();
        reanchorAll();
        renderPanel();
      } catch (err) { alert('読み込みに失敗しました: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  document.getElementById('clearBtn').addEventListener('click', function () {
    if (!comments.length || confirm('すべてのコメントを削除しますか？')) {
      clearHighlights();
      comments = [];
      save(); renderPanel();
    }
  });
  function clearHighlights() {
    Array.prototype.forEach.call(doc.querySelectorAll('mark.cmt'), function (m) {
      var parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m); parent.normalize();
    });
  }

  // ── re-anchor on load ───────────────────
  function reanchorAll() {
    comments.forEach(function (c) {
      var el = c.anchorId ? document.getElementById(c.anchorId) : null;
      if (!el || !c.quote) return;
      var txt = el.textContent;
      var idx = -1, from = 0, n = 0, found = -1;
      while ((idx = txt.indexOf(c.quote, from)) !== -1) {
        if (n === (c.occurrence || 0)) { found = idx; break; }
        n++; from = idx + 1;
      }
      if (found === -1) found = txt.indexOf(c.quote);
      if (found === -1) return;
      var range = rangeFromOffsets(el, found, found + c.quote.length);
      if (range) { try { wrapRange(range, c.id); } catch (e) {} }
    });
  }

  // コードブロックに構文ハイライトを適用（同梱 highlight.js）。
  // .mermaid は <code> を持たないので対象外。再アンカー前に実行して以後のテキスト構造を確定させる。
  function highlightCode() {
    if (typeof window === 'undefined' || !window.hljs) return;
    Array.prototype.forEach.call(doc.querySelectorAll('pre code'), function (el) {
      try { window.hljs.highlightElement(el); } catch (e) {}
    });
  }

  // mermaid 図を先に SVG へ描画し、コードをハイライトしてから再アンカーする。
  // 描画でレイアウト/テキストが変わるため、順序を固定して再アンカーの安定性を保つ。
  function boot() { highlightCode(); reanchorAll(); renderPanel(); }
  var hasMermaid = doc.querySelector('.mermaid');
  if (hasMermaid && typeof window !== 'undefined' && window.mermaid) {
    try { window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' }); } catch (e) {}
    Promise.resolve()
      .then(function () { return window.mermaid.run({ querySelector: '#doc .mermaid' }); })
      .catch(function () {})
      .then(boot);
  } else {
    boot();
  }
})();
