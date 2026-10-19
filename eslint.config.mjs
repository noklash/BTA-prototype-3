import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Flat ESLint configuration for Next.js 16.
 *
 * The two `eslint-config-next` entries already ship as flat-config arrays, so
 * they are spread directly instead of being wrapped in a compatibility layer.
 */
const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Test files and the seed script are executed by Node/Vitest, not by the
    // Next.js bundler.
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**/*.ts', 'tests/**/*.tsx', 'scripts/**/*.mts', '*.config.ts', '*.config.mjs'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]

export default eslintConfig
