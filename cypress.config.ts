import { defineConfig } from "cypress";
import dotenvCypress from 'cypress-dotenv';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
  },

  env: {
    REFRESH_TOKEN_NAME: "refreshTokenDev",
    VITE_GRAPHQL_ENDPOINT: "http://localhost:8000/graphql/graphql",
    VITE_GOOGLE_API_ENDPOINT: "http://localhost:8000/docs"
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      return dotenvCypress(config, undefined, true);
    },
  },
});
