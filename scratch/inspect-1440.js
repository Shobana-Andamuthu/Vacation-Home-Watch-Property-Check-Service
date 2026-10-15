const { spawn } = require('child_process');

async function main() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--remote-debugging-port=9555',
    '--headless=new',
    '--user-data-dir=C:\\Users\\User\\AppData\\Local\\Temp\\chr-prof-8',
    'http://localhost:3000/dashboard.html'
  ]);

  try {
    await new Promise(r => setTimeout(r, 1200));
    const list = await (await fetch('http://127.0.0.1:9555/json/list')).json();
    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    await new Promise(res => ws.onopen = res);

    ws.send(JSON.stringify({
      id: 1,
      method: 'Emulation.setDeviceMetricsOverride',
      params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    }));
    await new Promise(r => setTimeout(r, 400));

    ws.send(JSON.stringify({
      id: 2,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const el70 = document.elementFromPoint(100, 70);
          const el100 = document.elementFromPoint(100, 100);
          const el130 = document.elementFromPoint(100, 130);
          
          function desc(e) {
            if (!e) return null;
            return e.tagName + (e.id ? '#' + e.id : '') + (e.className ? '.' + e.className : '');
          }
          
          return {
            at70: desc(el70),
            at100: desc(el100),
            at130: desc(el130)
          };
        })()`,
        returnByValue: true
      }
    }));

    const result = await new Promise((resolve) => {
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === 2) resolve(msg.result.result.value);
      };
    });

    console.log(JSON.stringify(result, null, 2));
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
