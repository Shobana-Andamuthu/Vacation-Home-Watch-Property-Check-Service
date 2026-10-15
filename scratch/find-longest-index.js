const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

let bestCleaned = '';
let bestLineCount = 0;

for (let i = 0; i < lines.length; i++) {
  try {
    const res = JSON.parse(lines[i]);
    const text = res.content || '';
    if (text.includes('1: <!DOCTYPE html>') && text.includes('Vacation Home Watch')) {
      const startIdx = text.indexOf('1: <!DOCTYPE html>');
      const fileSnippet = text.slice(startIdx);
      const endMarker = 'The above content does NOT show the entire file contents';
      const endMarker2 = 'The above content shows the entire, complete file contents';
      let endIdx = fileSnippet.indexOf(endMarker);
      if (endIdx === -1) endIdx = fileSnippet.indexOf(endMarker2);
      const codeWithLineNumbers = endIdx !== -1 ? fileSnippet.slice(0, endIdx) : fileSnippet;
      
      const cleanLines = codeWithLineNumbers.split('\n').map(line => {
        const m = line.match(/^\d+:\s?(.*)$/);
        return m ? m[1] : line;
      });
      
      if (cleanLines.length > bestLineCount) {
        bestLineCount = cleanLines.length;
        bestCleaned = cleanLines.join('\n').trim();
        console.log(`Found candidate at line ${i} with ${bestLineCount} lines`);
      }
    }
  } catch (e) {}
}

if (bestCleaned) {
  fs.writeFileSync('index.html', bestCleaned + '\n', 'utf8');
  console.log(`✓ Restored index.html with ${bestLineCount} lines!`);
}
