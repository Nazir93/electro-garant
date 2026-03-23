#!/usr/bin/env bash
# Запуск на VPS из папки frontend:  bash scripts/vps-deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "Нет файла .env — скопируй с ПК:"
  echo "  scp .env.local root@IP:/var/www/electro-garant/frontend/.env"
  echo "или: cp .env.example .env && nano .env"
  exit 1
fi

echo "==> npm ci"
npm ci

echo "==> prisma generate"
npx prisma generate

echo "==> prisma migrate deploy"
npx prisma migrate deploy

echo "==> next build"
npm run build

echo ""
echo "Готово. Запуск:"
echo "  npm run start"
echo "или PM2:  pm2 start npm --name electro -- start"
