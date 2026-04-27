#!/bin/sh
set -eu

check_tool() {
  name="$1"
  install_hint="$2"

  if command -v "$name" >/dev/null 2>&1; then
    printf "ok: %s (%s)\n" "$name" "$(command -v "$name")"
  else
    printf "missing: %s\n  install: %s\n" "$name" "$install_hint"
  fi
}

printf "Checking local agent tooling...\n\n"

check_tool git "Install Xcode Command Line Tools or Git."
check_tool node "Install Node.js."
check_tool npm "Install npm with Node.js."
check_tool codex "npm i -g @openai/codex"
check_tool claude "curl -fsSL https://claude.ai/install.sh | bash"
check_tool apm "curl -sSL https://aka.ms/apm-unix | sh"
check_tool gemini "npm install -g @google/gemini-cli"
check_tool opencode "curl -fsSL https://opencode.ai/install | bash"

printf "\nNo tools were installed automatically.\n"
