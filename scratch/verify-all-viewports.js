const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9444;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(ws) {
    this.ws = ws;
    this.id = 1;
    this.callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const reqId = this.id++;
      this.callbacks.set(reqId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: reqId, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : undefined;
  }
}

async function main() {
  const scratchDir = path.join(__dirname);
  const profileDir = path.join(scratchDir, 'chrome-temp-prof');
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

  console.log('Starting Chrome on port', PORT);
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--user-data-dir=${profileDir}`,
    'http://localhost:3000/dashboard.html'
  ]);

  try {
    let wsUrl = null;
    let target = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        const list = await res.json();
        target = list.find(t => t.type === 'page');
        if (target && target.webSocketDebuggerUrl) {
          wsUrl = target.webSocketDebuggerUrl;
          break;
        }
      } catch (e) {
        await sleep(200);
      }
    }

    if (!wsUrl) throw new Error('Chrome remote debug page target not found');

    const ws = new WebSocket(wsUrl);

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    const client = new CDPClient(ws);
    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    await sleep(1000);

    const testViewports = [
      { width: 1440, height: 900, name: '1440px-Desktop' },
      { width: 1024, height: 768, name: '1024px-iPadLandscape' },
      { width: 768, height: 1024, name: '768px-iPadPortrait' },
      { width: 414, height: 896, name: '414px-MobileLarge' },
      { width: 375, height: 667, name: '375px-MobileStandard' },
      { width: 320, height: 568, name: '320px-MobileCompact' }
    ];

    const results = [];

    for (const vp of testViewports) {
      console.log(`\n========================================`);
      console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`========================================`);

      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 1024
      });

      await sleep(400);

      // On mobile/tablet < 1024px, let's test drawer open to verify sidebar layout!
      if (vp.width < 1024) {
        await client.eval(`
          const btn = document.getElementById('dashboard-sidebar-toggle');
          if (btn && !document.querySelector('.dashboard-sidebar').classList.contains('open')) {
            btn.click();
          }
        `);
        await sleep(350); // wait for drawer transition
      }

      const metrics = await client.eval(`
        (() => {
          const nav = document.getElementById('dashboard-top-navbar') || document.querySelector('.site-header');
          const navHeader = document.querySelector('.site-header.dashboard-header');
          const sidebar = document.querySelector('.dashboard-sidebar');
          const stickyWrap = document.querySelector('.sidebar-sticky-wrap');
          const topSec = document.querySelector('.sidebar-top-section');
          const estateCard = document.querySelector('.sidebar-estate-card');
          const navList = document.querySelector('.dashboard-nav-list');
          const inspectorBox = document.querySelector('.sidebar-inspector-box');
          const footerCard = document.querySelector('.sidebar-footer-card');
          const userCard = document.querySelector('.sidebar-user-card');
          const signoutBtn = document.querySelector('.sidebar-signout-btn');
          const mainContent = document.querySelector('.dashboard-content');
          const h1 = document.querySelector('.dashboard-header-text h1');
          
          const navRect = navHeader ? navHeader.getBoundingClientRect() : { top: 0, bottom: 0, height: 0 };
          const sbRect = sidebar ? sidebar.getBoundingClientRect() : { top: 0, bottom: 0, height: 0, width: 0 };
          const estateRect = estateCard ? estateCard.getBoundingClientRect() : { top: 0, bottom: 0 };
          const footerRect = footerCard ? footerCard.getBoundingClientRect() : { top: 0, bottom: 0, height: 0 };
          const h1Rect = h1 ? h1.getBoundingClientRect() : { top: 0 };
          
          const windowW = window.innerWidth;
          const windowH = window.innerHeight;
          const scrollW = document.documentElement.scrollWidth;
          const hasHScroll = scrollW > windowW;
          
          return {
            windowW,
            windowH,
            scrollW,
            hasHScroll,
            nav: {
              top: navRect.top,
              bottom: navRect.bottom,
              height: navRect.height
            },
            sidebar: {
              top: sbRect.top,
              bottom: sbRect.bottom,
              height: sbRect.height,
              width: sbRect.width,
              gapBelowNavbar: sbRect.top - navRect.bottom,
              gapToBottomEdge: windowH - sbRect.bottom
            },
            estateTop: estateRect.top,
            h1Top: h1Rect.top,
            footerCard: {
              top: footerRect.top,
              bottom: footerRect.bottom,
              distFromSidebarBottom: sbRect.bottom - footerRect.bottom,
              isVisibleInSidebar: footerRect.bottom <= sbRect.bottom + 2
            },
            topSectionScrollable: topSec ? (topSec.scrollHeight >= topSec.clientHeight) : false,
            isOpen: sidebar ? sidebar.classList.contains('open') : false
          };
        })()
      `);

      console.log('Metrics evaluated:', JSON.stringify(metrics, null, 2));
      results.push({ viewport: vp.name, ...metrics });

      // Capture screenshot
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      const imgPath = path.join(scratchDir, `dashboard_${vp.width}.png`);
      fs.writeFileSync(imgPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot to ${imgPath}`);
    }

    fs.writeFileSync(path.join(scratchDir, 'test-results.json'), JSON.stringify(results, null, 2));
    console.log('\nAll viewport tests completed successfully!');
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
