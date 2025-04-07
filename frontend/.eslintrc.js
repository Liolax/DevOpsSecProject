module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
      jest: true, // if using Jest
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: [
      "react",
      "react-hooks",
    ],
    rules: {
      // Customize rules:
      "react/prop-types": "off",
      "no-console": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  