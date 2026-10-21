const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.overrides = {
  "braces": "^3.0.3",
  "micromatch": "^4.0.8",
  "chokidar": "^3.6.0",
  "fast-glob": "^3.3.2",
  "glob": "^10.4.5",
  "postcss-selector-parser": "^7.1.7",
  "postcss": "^8.5.31",
  "next": {
    "postcss": "^8.5.31"
  }
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
