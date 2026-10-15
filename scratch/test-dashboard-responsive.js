const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWebSocketUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const data = await res.json();
      if (data.webSocketDebuggerUrl) {
        return data.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(300);
    }
  }
  throw new Error('Could not connect to Chrome debugger');
}

async function run() {
  const scratchDir = path.join(__dirname);
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  console.log('Launching headless Chrome...');
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=' + path.join(scratchDir, 'chrome-profile')
  ]);

  try {
    const wsUrl = await getWebSocketUrl();
    console.log('CDP connected:', wsUrl);

    // Create a new target/tab
    const createRes = await fetch(`http://127.0.0.1:${PORT}/json/new?http://localhost:3000/dashboard.html`);
    const target = await createRes.json();
    const targetWsUrl = target.webSocketDebuggerUrl;

    const WebSocket = require('stream'); // fallback check or use native ws if available or CDP HTTP
    // Use CDP HTTP endpoint for evaluate if WebSocket package is not present
    console.log('Target created:', target.id);

    // Let's test using Chrome CLI screenshot directly for simple capture and evaluation
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
