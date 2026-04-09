import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "args": "none",
          "ignoreRestSiblings": true
        }
      ],
      'jsx-quotes': ['error', 'prefer-double'],
      "quotes": [
        "error",
        "single"
      ],
      "semi": [
        "error",
        "always"
      ],
      "react-hooks/exhaustive-deps": "off",
      "no-console": "warn",
      "no-multiple-empty-lines": [
        "error",
        {
          "max": 1, // Maximum number of consecutive blank lines allowed
          "maxEOF": 1, // Maximum number of blank lines allowed at the end of the file
          "maxBOF": 0 // Maximum number of blank lines allowed at the beginning of the file
        }
      ]
    },
    ignores: [
      'public/**',
      '.vscode/**',
      'dist/**',
      'node_modules/**',
      'src/components/ui/**',
      '*.js'
    ]
  },
)
