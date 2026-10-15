const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/recovered_index_raw.json', 'utf8'));

// Find tool_calls or content
let code = null;
if (raw.tool_calls) {
  for (const tc of raw.tool_calls) {
    if (tc.name === 'write_to_file' && tc.args.TargetFile && tc.args.TargetFile.endsWith('index.html')) {
      code = tc.args.CodeContent;
      break;
    }
  }
}

if (!code && raw.content) {
  // Check if write_to_file or code block is in content
  console.log('Checking raw content...');
}

if (code) {
  fs.writeFileSync('index.html', code, 'utf8');
  console.log('✓ Successfully restored index.html, size:', code.length);
} else {
  console.log('Tool call write_to_file not found in last occurrence, scanning all lines of transcript...');
  const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    try {
      const parsed = JSON.parse(lines[i]);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'write_to_file' && tc.args?.TargetFile?.endsWith('index.html')) {
            fs.writeFileSync('index.html', tc.args.CodeContent, 'utf8');
            console.log('✓ Found write_to_file for index.html at line', i, 'size:', tc.args.CodeContent.length);
            process.exit(0);
          }
        }
      }
    } catch (e) {}
  }
}
