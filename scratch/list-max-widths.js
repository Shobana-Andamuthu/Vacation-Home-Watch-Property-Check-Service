const fs = require('fs');

const css = fs.readFileSync('assets/css/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('max-width')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
