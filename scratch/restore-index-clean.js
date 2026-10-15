const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('view_file') && lines[i].includes('index.html')) {
    // The response is usually on the next line (i + 1)
    try {
      const res = JSON.parse(lines[i + 1]);
      if (res.content && res.content.includes('<!DOCTYPE html>')) {
        console.log(`Found index.html in line ${i + 1}!`);
        // The view_file output format has "1: <!DOCTYPE html>\n2: ..."
        // Strip line numbers "123: " from each line
        const rawText = res.content;
        const startIdx = rawText.indexOf('1: <!DOCTYPE html>');
        if (startIdx !== -1) {
          const fileSnippet = rawText.slice(startIdx);
          const endMarker = 'The above content does NOT show the entire file contents';
          const endMarker2 = 'The above content shows the entire, complete file contents';
          let endIdx = fileSnippet.indexOf(endMarker);
          if (endIdx === -1) endIdx = fileSnippet.indexOf(endMarker2);
          const codeWithLineNumbers = endIdx !== -1 ? fileSnippet.slice(0, endIdx) : fileSnippet;
          
          const cleanLines = codeWithLineNumbers.split('\n').map(line => {
            const m = line.match(/^\d+:\s?(.*)$/);
            return m ? m[1] : line;
          });
          
          const cleaned = cleanLines.join('\n').trim();
          console.log(`Cleaned length: ${cleaned.length}, lines: ${cleanLines.length}`);
          fs.writeFileSync('index.html', cleaned + '\n', 'utf8');
          console.log('✓ Successfully wrote index.html!');
          break;
        }
      }
    } catch (e) {
      // continue
    }
  }
}
