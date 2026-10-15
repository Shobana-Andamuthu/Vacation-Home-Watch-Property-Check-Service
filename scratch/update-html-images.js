const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function updateFile(file, replacer) {
  const filePath = path.join(rootDir, file);
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = replacer(original);
  if (original !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✓ Updated ${file}`);
  } else {
    console.log(`- No changes needed for ${file}`);
  }
}

// 1. index.html
updateFile('index.html', content => {
  return content
    .replace(/assets\/images\/mail-collection\.svg/g, 'assets/images/mail-collection.jpg')
    .replace(/assets\/images\/issue-reporting\.svg/g, 'assets/images/issue-reporting.jpg')
    .replace(/assets\/images\/dashboard-experience\.svg/g, 'assets/images/dashboard-experience.jpg');
});

// 2. home-2.html
updateFile('home-2.html', content => {
  return content
    .replace(/assets\/images\/report-sample-1\.svg/g, 'assets/images/report-sample-1.jpg')
    .replace(/assets\/images\/report-sample-2\.svg/g, 'assets/images/report-sample-2.jpg')
    .replace(/assets\/images\/report-sample-3\.svg/g, 'assets/images/report-sample-3.jpg')
    .replace(/assets\/images\/report-sample-4\.svg/g, 'assets/images/report-sample-4.jpg')
    .replace(/assets\/images\/dashboard-experience\.svg/g, 'assets/images/dashboard-experience.jpg')
    .replace(/assets\/images\/service-doors-windows\.jpg/g, 'assets/images/storm-prep.jpg');
});

// 3. services.html
updateFile('services.html', content => {
  return content
    .replace(/assets\/images\/plumbing-system\.svg/g, 'assets/images/plumbing-system.jpg')
    .replace(/assets\/images\/perimeter-check\.svg/g, 'assets/images/perimeter-check.jpg')
    .replace(/assets\/images\/mail-collection\.svg/g, 'assets/images/mail-collection.jpg')
    .replace(/assets\/images\/report-sample-1\.svg/g, 'assets/images/report-sample-1.jpg')
    .replace(/assets\/images\/report-sample-2\.svg/g, 'assets/images/report-sample-2.jpg')
    .replace(/assets\/images\/report-sample-3\.svg/g, 'assets/images/report-sample-3.jpg')
    .replace(/assets\/images\/report-sample-4\.svg/g, 'assets/images/report-sample-4.jpg');
});

// 4. about.html
updateFile('about.html', content => {
  return content
    .replace(/assets\/images\/service-inspection\.jpg/g, 'assets/images/perimeter-check.jpg')
    .replace(/assets\/images\/hero-coastal\.jpg/g, 'assets/images/contact-concierge.jpg');
});

// 5. dashboard.html
updateFile('dashboard.html', content => {
  return content
    .replace(/assets\/images\/report-sample-1\.svg/g, 'assets/images/report-sample-1.jpg')
    .replace(/assets\/images\/report-sample-2\.svg/g, 'assets/images/report-sample-2.jpg')
    .replace(/assets\/images\/report-sample-3\.svg/g, 'assets/images/report-sample-3.jpg')
    .replace(/assets\/images\/report-sample-4\.svg/g, 'assets/images/report-sample-4.jpg')
    .replace(/assets\/images\/mail-collection\.svg/g, 'assets/images/mail-collection.jpg');
});

// 6. assets/js/dashboard.js
updateFile('assets/js/dashboard.js', content => {
  let updated = content
    .replace(/'assets\/images\/report-sample-1\.svg'/g, "'assets/images/report-sample-1.jpg'")
    .replace(/'assets\/images\/report-sample-2\.svg'/g, "'assets/images/report-sample-2.jpg'")
    .replace(/'assets\/images\/report-sample-3\.svg'/g, "'assets/images/report-sample-3.jpg'")
    .replace(/'assets\/images\/report-sample-4\.svg'/g, "'assets/images/report-sample-4.jpg'");
  
  updated = updated.replace(
    /\{ src: 'assets\/images\/report-sample-1\.jpg', title: 'Exterior Deck & Trellis', status: 'Clear' \},\s*\{ src: 'assets\/images\/report-sample-3\.jpg', title: 'Basement Heating & Valves', status: 'Optimal' \}/g,
    "{ src: 'assets/images/report-sample-5.jpg', title: 'Exterior Deck & Trellis', status: 'Clear' },\n        { src: 'assets/images/report-sample-6.jpg', title: 'HVAC & Ambient Thermostat', status: 'Optimal' }"
  );
  return updated;
});
