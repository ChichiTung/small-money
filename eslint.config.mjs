import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('prettier'), // 加入 Prettier 支援
  {
    rules: {
      // 移除 prettier/prettier 規則，改用以下規則
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
    },
  },
];

export default eslintConfig;
