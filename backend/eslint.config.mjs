// eslint.config.mjs
import js from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import jsdoc from "eslint-plugin-jsdoc"
import prettier from "eslint-plugin-prettier"
//import promise from "eslint-plugin-promise";
import security from "eslint-plugin-security"
import unusedImports from "eslint-plugin-unused-imports"
//import pluginNode from "eslint-plugin-node"; // Renamed for clarity
import globals from "globals"

export default [
  // 1. Add global ignores. It's good practice.
  {
    ignores: ["node_modules/"],
  },

  // 2. Apply ESLint's recommended rules to all relevant files.
  js.configs.recommended,

  // 3. Configure your project-specific rules for common JS files.
  {
    files: ["**/*.{js,mjs,cjs}"], // Apply to all JS-related files
    plugins: {
      // The key is the name you'll use in rules (e.g., 'import/no-unresolved'),
      // and the value is the plugin object itself.
      import: importPlugin,
      jsdoc: jsdoc,
      prettier: prettier,
      security: security,
      "unused-imports": unusedImports, // Use quotes for kebab-case names
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // ESLint Recommended Rules (from plugin configs)
      ...importPlugin.configs.recommended.rules,
      ...jsdoc.configs["recommended-error"].rules, // JSDoc recommended rules (errors)
      ...security.configs.recommended.rules, // Security plugin recommended rules
      "prettier/prettier": "error", // Enable Prettier rule to integrate it with ESLint

      // Your custom rule overrides:
      "no-unused-vars": "off", // Handled by unused-imports
      "import/no-dynamic-require": "warn",
      "import/no-nodejs-modules": "off", // Disable if you're using Node.js core modules

      // unused-imports rules (often used with no-unused-vars set to 'off')
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // JSDoc rule overrides/additions
      "jsdoc/require-returns": "off", // Example: disable if you don't always need @returns
      "jsdoc/require-param-description": "off", // Example: disable if param descriptions are optional
    },
  },
  // 4. Configuration specifically for your ES Module files (like this one)
  {
    files: ["**/*.mjs"],
    languageOptions: {
      sourceType: "module", // <-- Crucial: Tell ESLint these are ES Module files
      globals: {
        ...globals.node,
      },
    },
  },
]
