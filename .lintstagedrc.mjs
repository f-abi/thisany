export default {
  '*.md': ['prettier --write'],
  '*.vue': ['prettier --write', 'eslint --fix'],
  '*.{js,mjs,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{scss,less,html,vue,css}': ['prettier --write'],
  'package.json': ['prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json']
}
