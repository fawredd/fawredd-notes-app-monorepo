// eslint.config.mjs
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  // 1. Add global ignores. It's good practice.
  {
    ignores: ["node_modules/"],
  },

  // 2. Apply ESLint's recommended rules to all relevant files.
  // This replaces the old `extends: ["eslint:recommended"]` or `extends: ["js/recommended"]`.
  js.configs.recommended,
  
  // 3. Configure your project-specific rules.
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      // The key is the name you'll use in rules (e.g., 'import/no-unresolved'),
      // and the value is the plugin object itself.
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Correct, based on your package.json
      globals: {
        // For a backend project, 'globals.node' is more appropriate than 'globals.browser'.
        ...globals.node,
      },
    },
    rules: {
      // You can include recommended rules from plugins like this:
      ...importPlugin.configs.recommended.rules,
      
      // Your custom rule overrides:
      "no-unused-vars": "off",
      "import/no-dynamic-require": "warn",

      // This rule prevents importing Node.js core modules (e.g., 'fs', 'path').
      // For a backend application, you almost certainly want to disable this.
      "import/no-nodejs-modules": "off", 
    },
  },
    // 4. Configuration specifically for your ES Module files (like this one)
  // This ensures ESLint can parse .mjs files without errors.
  {
    files: ["**/*.mjs"],
    languageOptions: {
      sourceType: "module", // <-- Crucial: Tell ESLint these are ES Module files
      globals: {
        ...globals.node,
      },
    },
  },
];