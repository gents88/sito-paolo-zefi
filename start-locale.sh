#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/.logs"
mkdir -p "$LOG_DIR"

export PORT="${PORT:-3000}"
export JWT_SECRET="${JWT_SECRET:-super_secret_key}"
export JWT_EXPIRATION="${JWT_EXPIRATION:-24h}"
export CORS_ORIGIN="${CORS_ORIGIN:-http://localhost:4200}"

MONGO_PORT="27017"
MONGO_DB="sito_db"
LOCAL_MONGO_DATA="$HOME/.local/share/sito-paulo-zefi-mongo"
export DATABASE_URL="${DATABASE_URL:-mongodb://localhost:${MONGO_PORT}/${MONGO_DB}?replicaSet=rs0}"

USE_DOCKER=0

function start_docker_mongo() {
  echo "[1/5] Docker rilevato. Avvio MongoDB (docker compose)..."
  (cd "$ROOT_DIR" && docker compose up -d mongodb)

  echo -n "Attendo che MongoDB sia pronto"
  for i in $(seq 1 60); do
    if (cd "$ROOT_DIR" && docker compose exec -T mongodb mongosh --quiet --eval "rs.status().ok" >/dev/null 2>&1); then
      echo ""
      USE_DOCKER=1
      return 0
    fi
    echo -n "."
    sleep 2
  done

  echo ""
  echo "Errore: MongoDB (Docker) non è pronto in tempo. Controlla 'docker compose logs mongodb'."
  exit 1
}

function ensure_local_mongo_tools() {
  local missing=0
  command -v mongod >/dev/null 2>&1 || missing=1
  command -v mongosh >/dev/null 2>&1 || missing=1

  if [ "$missing" = "1" ] && command -v brew >/dev/null 2>&1; then
    echo "[1/5] MongoDB non trovato: installazione locale in corso..."
    brew tap mongodb/brew >/dev/null 2>&1 || true
    brew install mongodb-community mongosh || true
  fi

  if ! command -v mongod >/dev/null 2>&1 || ! command -v mongosh >/dev/null 2>&1; then
    echo "Errore: impossibile trovare mongod/mongosh. Installa MongoDB Community oppure avvia Docker Desktop."
    exit 1
  fi
}

function start_local_mongo() {
  mkdir -p "$LOCAL_MONGO_DATA"

  if mongosh --quiet --port "$MONGO_PORT" --eval "db.runCommand({ping:1}).ok" >/dev/null 2>&1; then
    echo "[2/5] MongoDB locale già in esecuzione sulla porta $MONGO_PORT."
  else
    echo "[2/5] Avvio MongoDB locale (replica set a singolo nodo)..."
    mongod --dbpath "$LOCAL_MONGO_DATA" --port "$MONGO_PORT" --bind_ip 127.0.0.1 --replSet rs0 \
      --logpath "$LOG_DIR/mongod.log" --fork
  fi

  echo -n "Attendo che MongoDB sia pronto"
  for i in $(seq 1 60); do
    if mongosh --quiet --port "$MONGO_PORT" --eval "db.runCommand({ping:1}).ok" >/dev/null 2>&1; then
      break
    fi
    echo -n "."
    sleep 1
  done
  echo ""

  if ! mongosh --quiet --port "$MONGO_PORT" --eval "db.runCommand({ping:1}).ok" >/dev/null 2>&1; then
    echo "Errore: MongoDB locale non è pronto. Controlla $LOG_DIR/mongod.log"
    exit 1
  fi

  mongosh --quiet --port "$MONGO_PORT" --eval \
    "try { rs.status().ok } catch (e) { rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:${MONGO_PORT}'}]}) }" >/dev/null 2>&1 || true

  echo -n "Attendo elezione del primary del replica set"
  for i in $(seq 1 30); do
    if mongosh --quiet --port "$MONGO_PORT" --eval "rs.isMaster().ismaster" 2>/dev/null | grep -q true; then
      break
    fi
    echo -n "."
    sleep 1
  done
  echo ""
}

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  start_docker_mongo
else
  echo "[1/5] Docker non disponibile, uso MongoDB locale."
  ensure_local_mongo_tools
  start_local_mongo
fi

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo "[3/5] Installazione dipendenze backend..."
  (cd "$BACKEND_DIR" && npm install)
else
  echo "[3/5] Dipendenze backend già presenti."
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "[4/5] Installazione dipendenze frontend..."
  (cd "$FRONTEND_DIR" && npm install)
else
  echo "[4/5] Dipendenze frontend già presenti."
fi

echo "[5/5] Avvio backend e frontend in background..."
(
  cd "$BACKEND_DIR"
  DATABASE_URL="$DATABASE_URL" npx prisma generate >/dev/null 2>&1 || true
  DATABASE_URL="$DATABASE_URL" npx prisma db push --skip-generate >/dev/null 2>&1 || true
  DATABASE_URL="$DATABASE_URL" npm run start:dev > "$LOG_DIR/backend.log" 2>&1
) &
BACKEND_PID=$!
printf '%s\n' "$BACKEND_PID" > "$LOG_DIR/backend.pid"

(
  cd "$FRONTEND_DIR"
  npm run start -- --host 0.0.0.0 --port 4200 > "$LOG_DIR/frontend.log" 2>&1
) &
FRONTEND_PID=$!
printf '%s\n' "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"

cleanup() {
  echo ""
  echo "Chiusura servizi..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  if [ "$USE_DOCKER" = "1" ]; then
    (cd "$ROOT_DIR" && docker compose down) >/dev/null 2>&1 || true
  else
    mongosh --quiet --port "$MONGO_PORT" --eval "db.getSiblingDB('admin').shutdownServer()" >/dev/null 2>&1 || true
  fi
  exit 0
}
trap cleanup INT TERM

sleep 12

echo ""
echo "Stack locale avviato."
echo "- Database: $DATABASE_URL"
echo "- Backend:  http://localhost:$PORT"
echo "- Frontend: http://localhost:4200"
echo "- Log backend:  $LOG_DIR/backend.log"
echo "- Log frontend: $LOG_DIR/frontend.log"
echo ""
echo "Per arrestare tutto: premi Ctrl+C in questo terminale."
echo ""

wait
