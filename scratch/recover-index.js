const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl';

if (fs.existsSync(logPath)) {
  console.log('Log file exists, size:', (fs.statSync(logPath).size / 1024 / 1024).toFixed(2), 'MB');
  const stream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let foundIndexHtml = [];
  rl.on('line', (line) => {
    if (line.includes('index.html') && (line.includes('<!DOCTYPE html>') || line.includes('<!doctype html>'))) {
      foundIndexHtml.push(line);
    }
  });

  rl.on('close', () => {
    console.log('Found occurrences:', foundIndexHtml.length);
    if (foundIndexHtml.length > 0) {
      // Find the latest full index.html
      const lastLine = foundIndexHtml[foundIndexHtml.length - 1];
      const parsed = JSON.parse(lastLine);
      console.log('Type of last occurrence:', parsed.type);
      // Let's write it to a test recovery file
      fs.writeFileSync('scratch/recovered_index_raw.json', JSON.stringify(parsed, null, 2));
      console.log('Saved raw recovery JSON to scratch/recovered_index_raw.json');
    }
  });
} else {
  console.log('Log file not found at', logPath);
}
