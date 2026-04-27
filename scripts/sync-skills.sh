#!/bin/sh
set -eu

printf "scripts/sync-skills.sh is kept for compatibility.\n"
printf "Use scripts/install.sh for interactive project/global installation.\n\n"

printf ".apm/ is the source of truth.\n"
printf "skills is a root-level symlink to .apm/skills for convenient browsing.\n"
printf "This script is conservative and does not overwrite files.\n\n"

if [ ! -d ".apm/skills" ]; then
  printf "error: .apm/skills does not exist\n" >&2
  exit 1
fi

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
  ln -s .apm/skills skills
  printf "created: skills -> .apm/skills\n"
fi

mkdir -p .codex/prompts .claude/commands .cursor/rules .opencode/commands .gemini/commands

printf "Agent-specific skill copies are managed by APM. Run 'apm install' to deploy them.\n"
printf "Current wrappers intentionally point back to .apm/ instead of duplicating content.\n"

# APM performs the actual agent-specific deployment from .apm/.
