import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    "https://raw.githubusercontent.com/getsafepay/raast-docs/main/api-reference/openapi.yaml",
  output: "src/generated",
  plugins: ["@hey-api/client-axios"],
});
