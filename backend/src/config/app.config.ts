/**
 * provides central application configuration settings.
 * defines server port and environment information.
 * used by server.ts when starting the HTTP server.
 * future enhancement: move values to environment variables.
 */

const config = {
  port: 3000,
  environment: 'development',
};

export default config;