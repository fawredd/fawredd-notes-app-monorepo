import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    "rules": {
      "semi": "off", // Disable the base ESLint semi rule
      "@typescript-eslint/semi": ["error", "always", { "omitLastSemicolon": true }] // Enable the TypeScript-specific rule and configure it to omit the last semicolon of a block
    }
  }
];

export default eslintConfig;
