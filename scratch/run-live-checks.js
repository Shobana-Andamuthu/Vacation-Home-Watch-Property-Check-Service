const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function testPage(url, evalFn) {
  const chrome = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9222', '--window-size=1440,900', url]);
  await sleep(1800);
  try {
    const listJson = await httpGet('http://127.0.0.1:9222/json/list');
    const tabs = JSON.parse(listJson);
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('No page tab found');
    const wsUrl = pageTab.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };
    await new Promise(r => ws.onopen = r);

    function evaluate(expr) {
      return new Promise(resolve => {
        const id = msgId++;
        callbacks.set(id, (msg) => {
          resolve(msg.result?.result?.value);
        });
        ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
      });
    }

    const res = await evalFn(evaluate);
    ws.close();
    return res;
  } finally {
    chrome.kill();
  }
}

async function main() {
  console.log('--- TESTING LOGIN.HTML ---');
  await testPage('http://localhost:3000/login.html', async (evaluate) => {
    const initial = await evaluate(`
      JSON.stringify({
        dir: document.documentElement.getAttribute('dir'),
        brandLeft: Math.round(document.querySelector('.nav-brand').getBoundingClientRect().left),
        actionsRight: Math.round(window.innerWidth - document.querySelector('.nav-actions').getBoundingClientRect().right),
        h1Align: window.getComputedStyle(document.querySelector('.login-form-side h1')).textAlign,
        hasDemoBox: document.querySelector('.login-form-side').textContent.includes('Demo Access Available'),
        hasBackToSite: document.querySelector('.nav-actions').textContent.includes('Back to Site'),
        hasGoogleBtn: !!document.getElementById('btn-login-google'),
        hasAppleBtn: !!document.getElementById('btn-login-apple'),
        hasMicrosoftBtn: !!document.getElementById('btn-login-microsoft')
      })
    `);
    console.log('Login Initial:', JSON.parse(initial));

    // Click RTL toggle
    await evaluate(`document.getElementById('rtl-toggle-btn').click()`);
    await sleep(300);
    const rtl = await evaluate(`
      JSON.stringify({
        dir: document.documentElement.getAttribute('dir'),
        brandRight: Math.round(window.innerWidth - document.querySelector('.nav-brand').getBoundingClientRect().right),
        actionsLeft: Math.round(document.querySelector('.nav-actions').getBoundingClientRect().left)
      })
    `);
    console.log('Login after RTL click:', JSON.parse(rtl));

    // Click LTR toggle
    await evaluate(`document.getElementById('rtl-toggle-btn').click()`);
    await sleep(300);
    const ltr = await evaluate(`document.documentElement.getAttribute('dir')`);
    console.log('Login after LTR click:', ltr);
  });

  console.log('\n--- TESTING DASHBOARD.HTML ---');
  await testPage('http://localhost:3000/dashboard.html', async (evaluate) => {
    const initial = await evaluate(`
      JSON.stringify({
        dir: document.documentElement.getAttribute('dir'),
        brandLeft: Math.round(document.querySelector('.dashboard-nav-brand-group').getBoundingClientRect().left),
        actionsRight: Math.round(window.innerWidth - document.querySelector('.nav-actions').getBoundingClientRect().right),
        sidebarLeft: Math.round(document.querySelector('.dashboard-sidebar').getBoundingClientRect().left)
      })
    `);
    console.log('Dashboard Initial:', JSON.parse(initial));

    // Click RTL toggle
    await evaluate(`document.getElementById('rtl-toggle-btn').click()`);
    await sleep(300);
    const rtl = await evaluate(`
      JSON.stringify({
        dir: document.documentElement.getAttribute('dir'),
        brandRight: Math.round(window.innerWidth - document.querySelector('.dashboard-nav-brand-group').getBoundingClientRect().right),
        actionsLeft: Math.round(document.querySelector('.nav-actions').getBoundingClientRect().left),
        sidebarRight: Math.round(window.innerWidth - document.querySelector('.dashboard-sidebar').getBoundingClientRect().right)
      })
    `);
    console.log('Dashboard after RTL click:', JSON.parse(rtl));

    // Click LTR toggle
    await evaluate(`document.getElementById('rtl-toggle-btn').click()`);
    await sleep(300);
    const ltr = await evaluate(`document.documentElement.getAttribute('dir')`);
    console.log('Dashboard after LTR click:', ltr);
  });

  console.log('\n--- TESTING INDEX.HTML NAVBAR ---');
  await testPage('http://localhost:3000/index.html', async (evaluate) => {
    const data = await evaluate(`
      JSON.stringify({
        brandLeft: Math.round(document.querySelector('.nav-brand').getBoundingClientRect().left),
        navLeft: Math.round(document.querySelector('.nav-navigation').getBoundingClientRect().left),
        actionsRight: Math.round(window.innerWidth - document.querySelector('.nav-actions').getBoundingClientRect().right)
      })
    `);
    console.log('Index Navbar Positions:', JSON.parse(data));
  });
}

main();
