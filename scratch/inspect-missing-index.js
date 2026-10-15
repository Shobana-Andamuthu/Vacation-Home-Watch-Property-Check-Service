const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

const lineNumbersFound = new Map();

for (let i = 0; i < lines.length; i++) {
  try {
    const res = JSON.parse(lines[i]);
    const text = res.content || '';
    if (text.includes('File Path:') && text.includes('index.html')) {
      const textLines = text.split('\n');
      for (const tl of textLines) {
        const lm = tl.match(/^(\d+):\s?(.*)$/);
        if (lm) {
          lineNumbersFound.set(parseInt(lm[1]), lm[2]);
        }
      }
    }
  } catch (e) {}
}

console.log('Line 235 to 245:');
for (let j = 235; j <= 245; j++) {
  console.log(`${j}: ${lineNumbersFound.get(j) || 'MISSING'}`);
}

console.log('\nLine 325 to 335:');
for (let j = 325; j <= 335; j++) {
  console.log(`${j}: ${lineNumbersFound.get(j) || 'MISSING'}`);
}
