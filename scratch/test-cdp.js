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

async function run() {
  const chrome = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9222', '--window-size=1440,900', 'about:blank']);
  await sleep(1500);

  try {
    const listJson = await httpGet('http://127.0.0.1:9222/json/list');
    const wsUrl = JSON.parse(listJson)[0].webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();
    let loadResolve = null;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.loadEventFired') {
        if (loadResolve) {
          loadResolve();
          loadResolve = null;
        }
      }
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };
    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise(resolve => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');

    function navigate(url) {
      return new Promise(async resolve => {
        loadResolve = resolve;
        await send('Page.navigate', { url });
      });
    }

    async function evaluate(expr) {
      const res = await send('Runtime.evaluate', { expression: `(() => { return JSON.stringify(${expr}); })()`, returnByValue: true });
      return res.result?.result?.value ? JSON.parse(res.result.result.value) : res;
    }

    console.log('\n=== TESTING LOGIN.HTML ===');
    await navigate('http://localhost:3000/login.html');
    await sleep(500);

    const loginData = await evaluate(`({
      dir: document.documentElement.getAttribute('dir'),
      brandLeft: Math.round(document.querySelector('.nav-brand').getBoundingClientRect().left),
      actionsRight: Math.round(window.innerWidth - document.querySelector('.nav-actions').getBoundingClientRect().right),
      h1Align: window.getComputedStyle(document.querySelector('.login-form-side h1')).textAlign,
      hasDemoBox: document.querySelector('.login-form-side').textContent.includes('Demo Access Available'),
      hasBackToSite: document.querySelector('.nav-actions').textContent.includes('Back to Site'),
      hasGoogleBtn: !!document.getElementById('btn-login-google'),
      hasAppleBtn: !!document.getElementById('btn-login-apple'),
      hasMicrosoftBtn: !!document.getElementById('btn-login-microsoft'),
      rtlBtnText: document.getElementById('rtl-toggle-btn').innerText.trim()
    })`);
    console.log('Login initial state:', loginData);

    // Click RTL
    await evaluate(`(document.getElementById('rtl-toggle-btn').click(), true)`);
    await sleep(300);
    const loginRtl = await evaluate(`({
      dir: document.documentElement.getAttribute('dir'),
      brandRight: Math.round(window.innerWidth - document.querySelector('.nav-brand').getBoundingClientRect().right),
      actionsLeft: Math.round(document.querySelector('.nav-actions').getBoundingClientRect().left)
    })`);
    console.log('Login after clicking RTL button:', loginRtl);

    // Click LTR
    await evaluate(`(document.getElementById('rtl-toggle-btn').click(), true)`);
    await sleep(300);
    const loginLtr = await evaluate(`document.documentElement.getAttribute('dir')`);
    console.log('Login after clicking back to LTR:', loginLtr);

    console.log('\n=== TESTING DASHBOARD.HTML ===');
    await navigate('http://localhost:3000/dashboard.html');
    await sleep(500);

    const dashData = await evaluate(`({
      dir: document.documentElement.getAttribute('dir'),
      brandLeft: Math.round(document.querySelector('.dashboard-nav-brand-group').getBoundingClientRect().left),
      actionsRight: Math.round(window.innerWidth - document.querySelector('.nav-actions').getBoundingClientRect().right),
      sidebarWidth: Math.round(document.querySelector('.dashboard-sidebar').getBoundingClientRect().width),
      sidebarLeft: Math.round(document.querySelector('.dashboard-sidebar').getBoundingClientRect().left)
    })`);
    console.log('Dashboard initial state (LTR):', dashData);

    // Click RTL
    await evaluate(`(document.getElementById('rtl-toggle-btn').click(), true)`);
    await sleep(300);
    const dashRtl = await evaluate(`({
      dir: document.documentElement.getAttribute('dir'),
      brandRight: Math.round(window.innerWidth - document.querySelector('.dashboard-nav-brand-group').getBoundingClientRect().right),
      actionsLeft: Math.round(document.querySelector('.nav-actions').getBoundingClientRect().left),
      sidebarRight: Math.round(window.innerWidth - document.querySelector('.dashboard-sidebar').getBoundingClientRect().right)
    })`);
    console.log('Dashboard after clicking RTL button:', dashRtl);

    // Click LTR
    await evaluate(`(document.getElementById('rtl-toggle-btn').click(), true)`);
    await sleep(300);
    const dashLtr = await evaluate(`document.documentElement.getAttribute('dir')`);
    console.log('Dashboard after clicking back to LTR:', dashLtr);

    console.log('\n=== TESTING INDEX.HTML NAVBAR ===');
    await navigate('http://localhost:3000/index.html');
    await sleep(500);

    const indexData = await evaluate(`({
      dir: document.documentElement.getAttribute('dir'),
      brandLeft: Math.round(document.querySelector('.nav-brand').getBoundingClientRect().left),
      navLeft: Math.round(document.querySelector('.nav-navigation').getBoundingClientRect().left),
      actionsRight: Math.round(window.innerWidth - document.querySelector('.nav-actions').getBoundingClientRect().right)
    })`);
    console.log('Index page navbar positions:', indexData);

    ws.close();
  } catch (err) {
    console.error('CDP Error:', err);
  } finally {
    chrome.kill();
  }
}

run();
