const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

const lineNumbersFound = new Map(); // lineNumber -> text

for (let i = 0; i < lines.length; i++) {
  try {
    const res = JSON.parse(lines[i]);
    const text = res.content || '';
    if (text.includes('File Path:') && text.includes('index.html')) {
      const match = text.match(/Showing lines (\d+) to (\d+)/);
      if (match) {
        console.log(`Transcript line ${i}: viewed lines ${match[1]} to ${match[2]}`);
        const textLines = text.split('\n');
        for (const tl of textLines) {
          const lm = tl.match(/^(\d+):\s?(.*)$/);
          if (lm) {
            lineNumbersFound.set(parseInt(lm[1]), lm[2]);
          }
        }
      }
    }
  } catch (e) {}
}

const sortedKeys = Array.from(lineNumbersFound.keys()).sort((a, b) => a - b);
console.log(`Total unique lines of index.html found: ${sortedKeys.length}`);
console.log(`Range: min=${sortedKeys[0]}, max=${sortedKeys[sortedKeys.length - 1]}`);

// Check for gaps
let missing = [];
for (let j = 1; j <= sortedKeys[sortedKeys.length - 1]; j++) {
  if (!lineNumbersFound.has(j)) {
    missing.push(j);
  }
}
console.log('Missing line count:', missing.length);
if (missing.length > 0) {
  console.log('Missing ranges:', missing.slice(0, 20), '...');
}
