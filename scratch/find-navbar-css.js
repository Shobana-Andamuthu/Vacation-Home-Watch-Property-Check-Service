const fs = require('fs');

const css = fs.readFileSync('assets/css/style.css', 'utf8');

const lines = css.split('\n');
console.log('--- Matches for container / navbar ---');
lines.forEach((line, idx) => {
  if (line.includes('.container') || line.includes('.navbar') || line.includes('--container-max') || line.includes('.nav-navigation') || line.includes('.nav-menu') || line.includes('.nav-actions') || line.includes('.site-header')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
