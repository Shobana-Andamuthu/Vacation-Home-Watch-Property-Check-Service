const fs = require('fs');
['login.html', 'dashboard.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const scripts = [...content.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0].slice(0, 80));
  console.log(f, scripts);
});
