const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

console.log('Total transcript lines:', lines.length);

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('view_file') && lines[i].includes('index.html')) {
    console.log(`Line ${i} has view_file on index.html`);
  }
}
