const { execFile } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function testPage(url) {
  return new Promise((resolve) => {
    const proc = execFile(chromePath, [
      '--headless=new',
      '--enable-logging=stderr',
      '--v=1',
      url
    ], (err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
    setTimeout(() => {
      proc.kill();
      resolve({ timeout: true });
    }, 4000);
  });
}

async function run() {
  console.log('Testing login.html:');
  const resLogin = await testPage('http://localhost:3000/login.html');
  console.log('Login stderr:', resLogin.stderr ? resLogin.stderr.slice(0, 300) : 'none');

  console.log('Testing dashboard.html:');
  const resDash = await testPage('http://localhost:3000/dashboard.html');
  console.log('Dash stderr:', resDash.stderr ? resDash.stderr.slice(0, 300) : 'none');
}

run();
