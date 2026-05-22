import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // Tell ESLint to ignore your build artifacts
  {
    ignores: ["dist/", "build/", "node_modules/"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Vital for Ink's JSX elements
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // 1. Core TypeScript recommendations
      ...tsPlugin.configs.recommended.rules,

      // 2. Ink/React Hook rules (ensures your terminal UI updates correctly)
      ...reactHooksPlugin.configs.recommended.rules,

      // 3. Turn off everything that conflicts with Prettier
      ...eslintConfigPrettier.rules,

      // 4. Personal Sanity Overrides (Add things here if they annoy you)
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of crashing on 'any'
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
