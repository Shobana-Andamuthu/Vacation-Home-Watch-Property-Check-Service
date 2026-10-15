const fs = require('fs');
const path = require('path');

const files = ['index.html', 'home-2.html', 'services.html', 'about.html', 'contact.html', 'login.html', 'dashboard.html'];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/class=["']([^"']*container[^"']*)["']/g)].map(m => m[1]);
  console.log(file, '->', matches.length, 'container elements:');
  console.log(matches);
}
