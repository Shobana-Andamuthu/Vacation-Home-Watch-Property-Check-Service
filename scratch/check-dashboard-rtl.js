const fs = require('fs');

const dHtml = fs.readFileSync('dashboard.html', 'utf8');
const dJs = fs.readFileSync('assets/js/dashboard.js', 'utf8');

console.log('--- Physical left/right styles in dashboard.html ---');
const inlineStyles = [...dHtml.matchAll(/style="([^"]*)"/g)].map(m => m[1]);
inlineStyles.forEach(s => {
  if (/margin-left|margin-right|padding-left|padding-right|float:|text-align:\s*(left|right)/i.test(s)) {
    console.log('Inline style with physical prop:', s);
  }
});
