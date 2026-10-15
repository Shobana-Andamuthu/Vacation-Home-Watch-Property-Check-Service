const { execFile } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function capture(url, fileName, width = 1440, height = 900) {
  const fullPath = path.resolve(__dirname, fileName);
  return new Promise((resolve) => {
    execFile(chromePath, [
      '--headless=new',
      `--window-size=${width},${height}`,
      `--screenshot=${fullPath}`,
      url
    ], (err, stdout, stderr) => {
      resolve({ fullPath, err, stdout, stderr });
    });
  });
}

async function testScreenshots() {
  console.log('Capturing login.html (1440x900)...');
  await capture('http://localhost:3000/login.html', 'login_1440.png');
  console.log('Capturing dashboard.html (1440x900)...');
  await capture('http://localhost:3000/dashboard.html', 'dashboard_1440.png');
  console.log('Capturing index.html (1440x900)...');
  await capture('http://localhost:3000/index.html', 'index_1440.png');
  console.log('Done capturing screenshots!');
}

testScreenshots();
