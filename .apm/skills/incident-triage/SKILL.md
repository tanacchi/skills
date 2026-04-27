---
name: incident-triage
description: Use this skill when responding to alerts, production issues, outages, degraded service, rollback decisions, log and metrics investigation, or postmortem preparation.
license: MIT
metadata:
  author: personal
  version: "0.1.0"
compatibility: Requires git and a coding-agent environment with file read/write access.
---

# Incident Triage

## 利用タイミング

alert、production issue、outage、performance degradation、rollback 判断、postmortem preparation を扱うときに使う。

## 確認する入力

- alert 内容と発生時刻
- user impact と affected scope
- recent deploy / config change
- logs, metrics, traces
- rollback / mitigation options

## Workflow

1. impact と urgency を確認する。
2. timeline を作る。
3. recent change と symptom を照合する。
4. mitigation と rollback の選択肢を出す。
5. 復旧後に原因、検知、再発防止を整理する。

## Output Format

- Current impact
- Known facts
- Hypotheses
- Immediate actions
- Follow-up / postmortem notes

## Guardrails

- 不確かな原因を断定しない。
- mitigation と root cause analysis を混同しない。
- user impact の把握を後回しにしない。

## Related References

- `references/alert-first-response.md`
