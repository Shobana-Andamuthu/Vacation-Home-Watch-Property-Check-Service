const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20';
const targetDir = path.resolve('assets/images');

// Mapping of generated artifact files to target filenames in assets/images/
const artifactFiles = fs.readdirSync(artifactDir);

function findArtifact(prefix) {
  const file = artifactFiles.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
  if (!file) throw new Error(`Artifact starting with ${prefix} not found`);
  return path.join(artifactDir, file);
}

const copyMap = {
  'report_patio_walk': 'report-sample-1.jpg',
  'report_door_lock': 'report-sample-2.jpg',
  'report_utility_valve': 'report-sample-3.jpg',
  'report_mail_secured': 'report-sample-4.jpg',
  'report_deck_check': 'report-sample-5.jpg',
  'report_hvac_check': 'report-sample-6.jpg',
  'service_mail_retrieval': 'mail-collection.jpg',
  'service_issue_reporting': 'issue-reporting.jpg',
  'dashboard_experience': 'dashboard-experience.jpg',
  'service_plumbing_check': 'plumbing-system.jpg',
  'service_perimeter_check': 'perimeter-check.jpg',
  'service_storm_prep': 'storm-prep.jpg',
  'contact_concierge': 'contact-concierge.jpg'
};

console.log('Copying generated HD images to assets/images/...');
for (const [prefix, targetName] of Object.entries(copyMap)) {
  const src = findArtifact(prefix);
  const dest = path.join(targetDir, targetName);
  fs.copyFileSync(src, dest);
  const size = (fs.statSync(dest).size / 1024).toFixed(1);
  console.log(`✓ Copied ${path.basename(src)} -> assets/images/${targetName} (${size} KB)`);
}
