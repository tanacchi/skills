#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_root"

scope=""
mode="symlink"
assume_yes=0
dry_run=0
run_apm=1

usage() {
  cat <<'EOF'
Usage: scripts/install.sh [options]

Options:
  --scope project|global|both  Install into this project, global agent dirs, or both.
  --mode symlink|copy          Global install mode. Default: symlink.
  --yes                        Run non-interactively with selected options.
  --dry-run                    Print actions without changing files.
  --no-apm                     Do not run apm install for project scope.
  -h, --help                   Show this help.

Environment overrides for global scope:
  CODEX_SKILLS_DIR             Default: $HOME/.codex/skills
  CLAUDE_SKILLS_DIR            Default: $HOME/.claude/skills
  GEMINI_SKILLS_DIR            Default: $HOME/.gemini/skills
  OPENCODE_SKILLS_DIR          Default: ${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills
  AGENTS_SKILLS_DIR            Default: $HOME/.agents/skills
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --scope)
      scope="${2:-}"
      shift 2
      ;;
    --scope=*)
      scope=${1#*=}
      shift
      ;;
    --mode)
      mode="${2:-}"
      shift 2
      ;;
    --mode=*)
      mode=${1#*=}
      shift
      ;;
    --yes)
      assume_yes=1
      shift
      ;;
    --dry-run)
      dry_run=1
      shift
      ;;
    --no-apm)
      run_apm=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf "error: unknown option: %s\n" "$1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$scope" in
  ""|project|global|both) ;;
  *)
    printf "error: --scope must be project, global, or both\n" >&2
    exit 1
    ;;
esac

case "$mode" in
  symlink|copy) ;;
  *)
    printf "error: --mode must be symlink or copy\n" >&2
    exit 1
    ;;
esac

run_cmd() {
  if [ "$dry_run" -eq 1 ]; then
    printf "dry-run: %s\n" "$*"
  else
    "$@"
  fi
}

ask_scope() {
  printf "Install scope:\n"
  printf "  1) project  - install into this repository with APM\n"
  printf "  2) global   - link skills into user-level agent directories\n"
  printf "  3) both     - project and global\n"
  printf "Select [1-3]: "
  read answer

  case "$answer" in
    1|project) scope="project" ;;
    2|global) scope="global" ;;
    3|both) scope="both" ;;
    *)
      printf "error: invalid scope selection\n" >&2
      exit 1
      ;;
  esac
}

ask_mode() {
  [ "$scope" = "global" ] || [ "$scope" = "both" ] || return 0

  printf "Global install mode:\n"
  printf "  1) symlink  - keep global entries pointing to this repo\n"
  printf "  2) copy     - copy skill directories into global locations\n"
  printf "Select [1-2]: "
  read answer

  case "$answer" in
    1|symlink) mode="symlink" ;;
    2|copy) mode="copy" ;;
    *)
      printf "error: invalid mode selection\n" >&2
      exit 1
      ;;
  esac
}

confirm() {
  [ "$assume_yes" -eq 1 ] && return 0

  printf "Proceed with scope=%s mode=%s dry_run=%s run_apm=%s? [y/N]: " "$scope" "$mode" "$dry_run" "$run_apm"
  read answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *)
      printf "aborted\n"
      exit 0
      ;;
  esac
}

ensure_source() {
  if [ ! -d ".apm/skills" ]; then
    printf "error: .apm/skills does not exist\n" >&2
    exit 1
  fi
}

ensure_root_symlink() {
  if [ -L "skills" ]; then
    target=$(readlink "skills")
    if [ "$target" != ".apm/skills" ]; then
      printf "error: skills symlink points to %s, expected .apm/skills\n" "$target" >&2
      exit 1
    fi
    printf "ok: skills -> .apm/skills\n"
  elif [ -e "skills" ]; then
    printf "error: skills exists but is not the managed symlink\n" >&2
    exit 1
  else
    run_cmd ln -s .apm/skills skills
    printf "created: skills -> .apm/skills\n"
  fi
}

install_project() {
  printf "\n== Project install ==\n"
  ensure_root_symlink
  run_cmd mkdir -p .codex/prompts .claude/commands .cursor/rules .opencode/commands .gemini/commands

  if [ "$run_apm" -eq 1 ]; then
    if command -v apm >/dev/null 2>&1; then
      run_cmd apm install
    else
      printf "warn: apm not found; skipped project agent deployment\n" >&2
    fi
  else
    printf "skipped: apm install disabled\n"
  fi
}

install_one_global_dir() {
  label="$1"
  target_dir="$2"

  printf "\n== Global install: %s -> %s ==\n" "$label" "$target_dir"
  run_cmd mkdir -p "$target_dir"

  for skill_dir in "$repo_root"/.apm/skills/*; do
    [ -d "$skill_dir" ] || continue
    name=$(basename "$skill_dir")
    target="$target_dir/$name"

    if [ -L "$target" ]; then
      current=$(readlink "$target")
      if [ "$current" = "$skill_dir" ]; then
        printf "ok: %s\n" "$target"
      else
        printf "skip: %s already links to %s\n" "$target" "$current"
      fi
    elif [ -e "$target" ]; then
      printf "skip: %s already exists\n" "$target"
    else
      if [ "$mode" = "symlink" ]; then
        run_cmd ln -s "$skill_dir" "$target"
      else
        run_cmd cp -R "$skill_dir" "$target"
      fi
      if [ "$dry_run" -eq 1 ]; then
        printf "would install: %s\n" "$target"
      else
        printf "installed: %s\n" "$target"
      fi
    fi
  done
}

install_global() {
  printf "\n== Global install ==\n"
  printf "mode: %s\n" "$mode"

  codex_dir=${CODEX_SKILLS_DIR:-"$HOME/.codex/skills"}
  claude_dir=${CLAUDE_SKILLS_DIR:-"$HOME/.claude/skills"}
  gemini_dir=${GEMINI_SKILLS_DIR:-"$HOME/.gemini/skills"}
  opencode_dir=${OPENCODE_SKILLS_DIR:-"${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills"}
  agents_dir=${AGENTS_SKILLS_DIR:-"$HOME/.agents/skills"}

  install_one_global_dir "codex" "$codex_dir"
  install_one_global_dir "claude" "$claude_dir"
  install_one_global_dir "gemini" "$gemini_dir"
  install_one_global_dir "opencode" "$opencode_dir"
  install_one_global_dir "agents" "$agents_dir"
}

ensure_source

if [ -z "$scope" ]; then
  ask_scope
fi

if [ "$assume_yes" -eq 0 ]; then
  ask_mode
fi

confirm

case "$scope" in
  project)
    install_project
    ;;
  global)
    install_global
    ;;
  both)
    install_project
    install_global
    ;;
esac

printf "\nInstall complete. Run scripts/validate.sh to verify repository metadata.\n"
