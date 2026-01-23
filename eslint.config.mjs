import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.turbo/**',
      '.next/**',
      '.nuxt/**',
      '.output/**',
      'coverage/**',
      '.vscode/**',
      'README.md',
      'turbo.json',
      'pnpm-lock.yaml'
    ]
  },
  prettier
]
