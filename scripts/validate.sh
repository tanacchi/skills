#!/bin/sh
set -eu

failures=0

fail() {
  printf "fail: %s\n" "$1" >&2
  failures=$((failures + 1))
}

require_file() {
  if [ ! -f "$1" ]; then
    fail "missing required file: $1"
  fi
}

require_file README.md
require_file LICENSE
require_file .gitignore
require_file AGENTS.md
require_file CLAUDE.md
require_file apm.yml
require_file .codex/instructions.md
require_file scripts/install.sh

if command -v rg >/dev/null 2>&1; then
  if rg -n '(/[U]sers/|/[h]ome/)' . --hidden -g '!/.git/**' -g '!apm_modules/**' >/tmp/skills-local-paths.$$; then
    while IFS= read -r match; do
      fail "machine-specific absolute path found: $match"
    done </tmp/skills-local-paths.$$
  fi
  rm -f /tmp/skills-local-paths.$$
else
  printf "info: rg not installed; skipping machine-specific path check\n"
fi

if [ ! -L "skills" ]; then
  fail "skills must be a symlink to .apm/skills"
else
  skills_target=$(readlink "skills")
  [ "$skills_target" = ".apm/skills" ] || fail "skills symlink points to '$skills_target', expected '.apm/skills'"
fi

for skill_dir in .apm/skills/*; do
  [ -d "$skill_dir" ] || continue
  skill_name=$(basename "$skill_dir")
  skill_file="$skill_dir/SKILL.md"

  if [ ! -f "$skill_file" ]; then
    fail "missing SKILL.md: $skill_dir"
    continue
  fi

  first_line=$(sed -n '1p' "$skill_file")
  [ "$first_line" = "---" ] || fail "$skill_file must start with YAML frontmatter"

  declared_name=$(sed -n 's/^name: *//p' "$skill_file" | head -n 1)
  description=$(sed -n 's/^description: *//p' "$skill_file" | head -n 1)

  [ -n "$declared_name" ] || fail "$skill_file missing name"
  [ -n "$description" ] || fail "$skill_file missing description"
  [ "$declared_name" = "$skill_name" ] || fail "$skill_file name '$declared_name' does not match directory '$skill_name'"
done

if command -v apm >/dev/null 2>&1; then
  printf "info: apm found: "
  apm --version || true
else
  printf "info: apm not installed; skipping apm checks\n"
fi

if [ "$failures" -gt 0 ]; then
  printf "validation failed: %s issue(s)\n" "$failures" >&2
  exit 1
fi

printf "validation passed\n"
