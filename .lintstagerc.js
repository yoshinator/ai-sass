module.export = {
  'src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': 'prettier --check',
  '*{js,jsx,ts,tsx}': 'eslint --max-warnings=0 --fix',
}
