module.exports = {
  apps: [
    {
      name: 'Gear',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      // instances: 2,
      // instance_var: "APP_INSTANCE_ID",
      // exec_mode: "cluster".
      // listen_timeout: 5000,
      restart_delay: 10000,
      max_restarts: 10,
    },
  ],
};
