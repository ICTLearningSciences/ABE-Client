import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
  },

  env: {
    REFRESH_TOKEN_NAME: "refreshTokenDev",
    REACT_APP_GRAPHQL_ENDPOINT: "http://localhost:8000/graphql/graphql",
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
