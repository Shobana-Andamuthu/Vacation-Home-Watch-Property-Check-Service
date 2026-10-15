const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const script = `
  const brand = document.querySelector('.nav-brand') || document.querySelector('.dashboard-nav-brand-group');
  const actions = document.querySelector('.nav-actions');
  const nav = document.querySelector('.nav-navigation');
  const brandRect = brand ? brand.getBoundingClientRect() : null;
  const actionsRect = actions ? actions.getBoundingClientRect() : null;
  const navRect = nav ? nav.getBoundingClientRect() : null;
  console.log(JSON.stringify({
    windowWidth: window.innerWidth,
    brand: brandRect ? { left: Math.round(brandRect.left), right: Math.round(brandRect.right), width: Math.round(brandRect.width) } : null,
    nav: navRect ? { left: Math.round(navRect.left), right: Math.round(navRect.right), width: Math.round(navRect.width) } : null,
    actions: actionsRect ? { left: Math.round(actionsRect.left), right: Math.round(actionsRect.right), width: Math.round(actionsRect.width) } : null
  }));
`;

function testUrl(url, width = 1440) {
  // We can use chrome with a small data URL or run a command
  // Or write a small html test file that includes the target page in an iframe or directly fetches
}

console.log('Testing completed.');
