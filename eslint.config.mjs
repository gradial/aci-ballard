import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPlugin from 'eslint-plugin-import';
import noRawTailwind from './eslint-rules/no-raw-tailwind-values.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
const gitignorePath = resolve(__dirname, '.gitignore');

const eslintConfig = [
  includeIgnoreFile(gitignorePath),
  { ignores: ['next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: eslintPlugin,
    },
  },
  {
    plugins: {
      'aci-rules': {
        rules: {
          'no-raw-tailwind-values': noRawTailwind,
        },
      },
    },
    rules: {
      'aci-rules/no-raw-tailwind-values': 'warn',
    },
  },
];

export default eslintConfig;
