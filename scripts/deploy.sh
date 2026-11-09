#!/usr/bin/env bash
set -euo pipefail

for name in DEPLOY_SSH_URL DEPLOY_SSH_PRIVATE_KEY DEPLOY_TARGET_DIR DEPLOY_SSH_KNOWN_HOSTS; do
  if [[ -z "${!name:-}" ]]; then
    echo "::error::Missing secret: $name"
    exit 1
  fi
done

# Restrict values used in SSH configuration and remote shell commands.
if [[ ! "$DEPLOY_SSH_URL" =~ ^ssh://([a-zA-Z0-9_][a-zA-Z0-9_-]*)@([a-zA-Z0-9][a-zA-Z0-9.-]*):([0-9]{1,5})$ ]]; then
  echo '::error::DEPLOY_SSH_URL must be ssh://user@hostname:port (DNS name or IPv4).'
  exit 1
fi
ssh_user="${BASH_REMATCH[1]}"
ssh_host="${BASH_REMATCH[2]}"
ssh_port="${BASH_REMATCH[3]}"
if (( 10#$ssh_port < 1 || 10#$ssh_port > 65535 )); then
  echo '::error::SSH port must be between 1 and 65535.'
  exit 1
fi
if [[ ! "$DEPLOY_TARGET_DIR" =~ ^/([a-zA-Z0-9_-][a-zA-Z0-9._-]*/)*[a-zA-Z0-9_-][a-zA-Z0-9._-]*/?$ ]]; then
  echo '::error::Target must be an absolute non-root directory using letters, digits, /, _, - and dots (no dot segments or spaces).'
  exit 1
fi
[[ -f dist/index.html ]] || { echo '::error::dist/index.html is missing. Run npm run build first.'; exit 1; }

umask 077
ssh_dir="$(mktemp -d)"
trap 'rm -rf -- "$ssh_dir"' EXIT
printf '%s\n' "$DEPLOY_SSH_PRIVATE_KEY" | tr -d '\r' > "$ssh_dir/key"
printf '%s\n' "$DEPLOY_SSH_KNOWN_HOSTS" > "$ssh_dir/known_hosts"
cat > "$ssh_dir/config" <<CONFIG
Host deploy-target
  HostName $ssh_host
  User $ssh_user
  Port $ssh_port
  IdentityFile "$ssh_dir/key"
  UserKnownHostsFile "$ssh_dir/known_hosts"
  StrictHostKeyChecking yes
  IdentitiesOnly yes
  BatchMode yes
  PasswordAuthentication no
  ConnectTimeout 15
  ServerAliveInterval 15
  ServerAliveCountMax 3
CONFIG

# Both machines need rsync. Keep old hashed assets for already-open pages.
echo 'Checking SSH connection and remote rsync...'
ssh -F "$ssh_dir/config" deploy-target "command -v rsync >/dev/null && mkdir -p -- '$DEPLOY_TARGET_DIR'"
export RSYNC_RSH="ssh -F $ssh_dir/config"

# Build timestamps change on fresh runners. Compare contents to avoid uploading
# unchanged media again. Convert carriage returns to lines for Actions live logs.
upload() {
  rsync -rzc --delay-updates --timeout=120 \
    --info=progress2,name1 --stats --human-readable --outbuf=N "$@" \
    | stdbuf -oL tr '\r' '\n'
}

echo 'Uploading assets (bytes / percent / speed / elapsed time)...'
SECONDS=0
upload --exclude='/index.html' dist/ "deploy-target:$DEPLOY_TARGET_DIR/"
echo "Assets completed in ${SECONDS}s. Publishing index.html..."
# Publish the entry point only after every asset has uploaded successfully.
upload dist/index.html "deploy-target:$DEPLOY_TARGET_DIR/"
echo "Deployment completed in ${SECONDS}s."
