// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      // Ошибка, если точка с запятой отсутствует.
      semi: ["error", "always"],
      // Ошибка, если для строковых литералов используются не одинарные кавычки.
      quotes: ["error", "double", { avoidEscape: true }],
      // Ошибка, если используется конкатенация строк вместо шаблонных литералов.
      "prefer-template": "error",
      // Ошибка, если в качестве коллбека используется не стрелочная функция.
      "prefer-arrow-callback": "error",
      // Ошибка, если в одном из ветвлений функция возвращает значение, а в другом нет.
      "consistent-return": "error",
      // Ошибка, если объявлен пустой интерфейс. Исключение, если он расширяет другой интерфейс.
      "@typescript-eslint/no-empty-interface": ["error", { allowSingleExtends: true }],
      // Ошибка, если при импорте типа не используется type.
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      // Обязывает указывать у функций тип возвращаемого значения.
      // '@typescript-eslint/explicit-function-return-type': [
      //   'error',
      //   {
      //     allowExpressions: true,
      //     allowHigherOrderFunctions: true,
      //     allowTypedFunctionExpressions: true,
      //   },
      // ],
    },
  },
];
