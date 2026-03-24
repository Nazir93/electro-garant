/**
 * PM2: процесс переживает выход из SSH и перезапускается при падении.
 * На VPS из папки frontend:
 *   npm ci && npx prisma generate && npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup   # один раз — выполнить выведенную команду sudo ...
 */
const path = require("path");

module.exports = {
  apps: [
    {
      name: "electro-next",
      cwd: __dirname,
      script: path.join(__dirname, "node_modules/next/dist/bin/next"),
      args: "start -H 0.0.0.0",
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 15,
      min_uptime: "10s",
      max_memory_restart: "900M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
