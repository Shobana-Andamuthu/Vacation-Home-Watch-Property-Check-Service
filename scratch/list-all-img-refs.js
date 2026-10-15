const fs = require('fs');

const files = ['index.html', 'home-2.html', 'services.html', 'about.html', 'contact.html', 'login.html', 'dashboard.html', 'assets/css/style.css'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const imgMatches = [...content.matchAll(/(?:src|url)\(["']?([^"')]+\.(?:svg|jpg|jpeg|png|webp))["']?\)/gi)].map(m => m[1]);
  const imgTagMatches = [...content.matchAll(/src=["']([^"']+\.(?:svg|jpg|jpeg|png|webp))["']/gi)].map(m => m[1]);
  const combined = Array.from(new Set([...imgMatches, ...imgTagMatches]));
  console.log(`\n=== ${f} ===`);
  combined.forEach(img => console.log('  ', img));
});
