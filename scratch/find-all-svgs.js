const fs = require('fs');
const path = require('path');

// 1. Check assets directory for SVG files
function listFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(listFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allAssets = listFiles('assets');
console.log('--- SVG files in assets/ ---');
allAssets.filter(f => f.endsWith('.svg')).forEach(f => console.log(f));

// 2. Check HTML files for .svg references in img, background, or data
const htmlFiles = ['index.html', 'home-2.html', 'services.html', 'about.html', 'contact.html', 'login.html', 'dashboard.html'];
console.log('\n--- .svg references in HTML files ---');
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/src=["']([^"']*\.svg[^"']*)["']/gi)].map(m => m[1]);
  if (matches.length > 0) {
    console.log(f, 'img src matches:', matches);
  }
});

// 3. Check JS files (e.g. dashboard.js)
console.log('\n--- .svg references in JS files ---');
const jsFiles = ['assets/js/dashboard.js', 'assets/js/main.js'];
jsFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const matches = [...content.matchAll(/['"]([^'"]*\.svg[^'"]*)['"]/gi)].map(m => m[1]);
    if (matches.length > 0) {
      console.log(f, 'matches:', matches);
    }
  }
});
