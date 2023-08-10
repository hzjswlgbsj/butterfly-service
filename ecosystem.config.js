module.exports = {
  apps: [
    {
      name: "y-websocket",
      script: "npx y-websocket",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 1234,
      },
    },
  ],
};
