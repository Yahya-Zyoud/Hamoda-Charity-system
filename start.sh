#!/usr/bin/env bash
# Starts local dev: MongoDB in Docker + frontend + backend

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${YELLOW}[start]${NC} $1"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $1"; }
error() { echo -e "${RED}[error]${NC} $1"; exit 1; }

# ── Prerequisites ──────────────────────────────────────────────────
command -v node   >/dev/null 2>&1 || error "node is not installed"
command -v npm    >/dev/null 2>&1 || error "npm is not installed"
command -v docker >/dev/null 2>&1 || error "docker is not installed"

# ── Install dependencies if missing ───────────────────────────────
if [ ! -d "node_modules" ]; then
  info "Installing root dependencies..."
  npm install --silent
fi

if [ ! -d "frontend/node_modules" ]; then
  info "Installing frontend dependencies..."
  npm install --silent --prefix frontend
fi

if [ ! -d "backend/node_modules" ]; then
  info "Installing backend dependencies..."
  npm install --silent --prefix backend
fi

# ── Start MongoDB container ────────────────────────────────────────
info "Starting MongoDB container..."
docker compose up -d db

info "Waiting for MongoDB to be ready..."
for i in $(seq 1 30); do
  if docker compose exec -T db mongosh --quiet --eval "db.adminCommand('ping').ok" >/dev/null 2>&1; then
    ok "MongoDB is ready"
    break
  fi
  if [ "$i" -eq 30 ]; then
    error "MongoDB did not become ready in time. Run: docker compose logs db"
  fi
  sleep 2
done

# ── Start frontend + backend ───────────────────────────────────────
ok "Starting frontend (port 5173) and backend (port 5000)..."
echo ""
npm run dev
