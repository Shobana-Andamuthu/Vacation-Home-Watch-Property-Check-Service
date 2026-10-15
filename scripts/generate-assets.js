const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Helper to create rich SVGs
function createSvg(filename, width, height, content) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#233247"/>
      <stop offset="100%" stop-color="#141d2b"/>
    </linearGradient>
    <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#426B58"/>
      <stop offset="100%" stop-color="#2c483b"/>
    </linearGradient>
    <linearGradient id="softSage" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8F7F2"/>
      <stop offset="100%" stop-color="#DCE6DD"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ba085"/>
      <stop offset="100%" stop-color="#426B58"/>
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  ${content}
</svg>`;
  fs.writeFileSync(path.join(imgDir, filename), svg);
  console.log(`Created ${filename}`);
}

// 1. mail-collection.svg
createSvg('mail-collection.svg', 800, 600, `
  <rect width="800" height="600" fill="url(#softSage)"/>
  <!-- Decorative background elements -->
  <circle cx="700" cy="100" r="180" fill="#426B58" opacity="0.08"/>
  <rect x="50" y="50" width="700" height="500" rx="24" fill="#ffffff" filter="url(#dropShadow)"/>
  
  <!-- Mailbox illustration -->
  <g transform="translate(140, 100)">
    <!-- Post -->
    <rect x="140" y="240" width="24" height="180" rx="4" fill="#233247"/>
    <rect x="110" y="410" width="84" height="16" rx="4" fill="#426B58"/>
    
    <!-- Mailbox Body -->
    <rect x="40" y="80" width="224" height="170" rx="30" fill="url(#sageGrad)"/>
    <rect x="50" y="90" width="204" height="150" rx="24" fill="#233247"/>
    
    <!-- Flag -->
    <rect x="250" y="110" width="8" height="60" rx="2" fill="#d9534f"/>
    <rect x="250" y="100" width="30" height="20" rx="3" fill="#d9534f"/>
    
    <!-- Mail slot / Door flap -->
    <rect x="75" y="130" width="154" height="26" rx="6" fill="#DCE6DD"/>
    <text x="152" y="148" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#233247" text-anchor="middle" letter-spacing="2">RESIDENCE MAIL</text>
    
    <!-- Letters & Envelopes -->
    <g transform="translate(60, 175) rotate(-6)">
      <rect x="0" y="0" width="130" height="75" rx="6" fill="#F8F7F2" stroke="#DCE6DD" stroke-width="2"/>
      <path d="M 0 0 L 65 42 L 130 0" fill="none" stroke="#426B58" stroke-width="2.5"/>
      <rect x="15" y="45" width="50" height="5" rx="2" fill="#DCE6DD"/>
      <rect x="15" y="55" width="35" height="5" rx="2" fill="#DCE6DD"/>
    </g>
    <g transform="translate(100, 185) rotate(5)">
      <rect x="0" y="0" width="125" height="70" rx="6" fill="#ffffff" stroke="#DCE6DD" stroke-width="2" filter="url(#dropShadow)"/>
      <path d="M 0 0 L 62.5 38 L 125 0" fill="none" stroke="#233247" stroke-width="2"/>
      <rect x="90" y="10" width="20" height="24" rx="2" fill="#DCE6DD"/>
    </g>
  </g>

  <!-- Status card overlay -->
  <g transform="translate(440, 130)">
    <rect width="250" height="340" rx="16" fill="#F8F7F2" stroke="#DCE6DD" stroke-width="1.5"/>
    <text x="24" y="45" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#233247">Mail Collection Log</text>
    <text x="24" y="68" font-family="system-ui, sans-serif" font-size="12" fill="#667085">Tracked on every property visit</text>
    
    <!-- Item 1 -->
    <rect x="24" y="95" width="202" height="60" rx="10" fill="#ffffff" stroke="#E9ECEF"/>
    <circle cx="48" cy="125" r="14" fill="#DCE6DD"/>
    <path d="M 42 125 L 46 129 L 54 121" fill="none" stroke="#426B58" stroke-width="2" stroke-linecap="round"/>
    <text x="70" y="120" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#233247">3 Envelopes Collected</text>
    <text x="70" y="136" font-family="system-ui, sans-serif" font-size="11" fill="#667085">Stored securely inside</text>
    
    <!-- Item 2 -->
    <rect x="24" y="165" width="202" height="60" rx="10" fill="#ffffff" stroke="#E9ECEF"/>
    <circle cx="48" cy="195" r="14" fill="#DCE6DD"/>
    <path d="M 42 195 L 46 199 L 54 191" fill="none" stroke="#426B58" stroke-width="2" stroke-linecap="round"/>
    <text x="70" y="190" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#233247">1 Package Retrieved</text>
    <text x="70" y="206" font-family="system-ui, sans-serif" font-size="11" fill="#667085">Front porch to foyer</text>

    <!-- Item 3 -->
    <rect x="24" y="235" width="202" height="60" rx="10" fill="#ffffff" stroke="#E9ECEF"/>
    <circle cx="48" cy="265" r="14" fill="#DCE6DD"/>
    <path d="M 42 265 L 46 269 L 54 261" fill="none" stroke="#426B58" stroke-width="2" stroke-linecap="round"/>
    <text x="70" y="260" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#233247">Box Emptied &amp; Locked</text>
    <text x="70" y="276" font-family="system-ui, sans-serif" font-size="11" fill="#667085">No flyer buildup</text>
  </g>
`);

// 2. plumbing-system.svg
createSvg('plumbing-system.svg', 800, 600, `
  <rect width="800" height="600" fill="url(#bgGrad)"/>
  <rect x="40" y="40" width="720" height="520" rx="20" fill="#1b2738" stroke="#2c3e56" stroke-width="2"/>
  
  <!-- Utility System Inspection Graphics -->
  <g transform="translate(80, 80)">
    <!-- Main Header -->
    <text x="0" y="30" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Systems &amp; Utility Visual Verification</text>
    <text x="0" y="55" font-family="system-ui, sans-serif" font-size="14" fill="#DCE6DD">Monitoring HVAC, water shutoff, leaks, and circuit panels during unoccupied weeks</text>
    
    <!-- Water Shutoff Valve Panel -->
    <g transform="translate(0, 90)">
      <rect width="300" height="320" rx="14" fill="#233247" stroke="#374d6b"/>
      <circle cx="150" cy="110" r="50" fill="none" stroke="#426B58" stroke-width="12"/>
      <circle cx="150" cy="110" r="44" fill="#1b2738"/>
      <!-- Valve handle -->
      <line x1="100" y1="110" x2="200" y2="110" stroke="#d9534f" stroke-width="14" stroke-linecap="round"/>
      <circle cx="150" cy="110" r="14" fill="#ffffff"/>
      <text x="150" y="200" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">Main Water Supply</text>
      <rect x="80" y="220" width="140" height="30" rx="6" fill="#426B58"/>
      <text x="150" y="240" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#ffffff" text-anchor="middle">STATUS: SECURE (OFF)</text>
      <text x="150" y="280" font-family="system-ui, sans-serif" font-size="12" fill="#DCE6DD" text-anchor="middle">Zero Pressure Loss Detected</text>
    </g>

    <!-- HVAC & Temperature Panel -->
    <g transform="translate(340, 90)">
      <rect width="300" height="320" rx="14" fill="#233247" stroke="#374d6b"/>
      <!-- Thermostat Dial -->
      <circle cx="150" cy="110" r="60" fill="none" stroke="#426B58" stroke-width="8" stroke-dasharray="260 80"/>
      <circle cx="150" cy="110" r="50" fill="#141d2b"/>
      <text x="150" y="115" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#ffffff" text-anchor="middle">72°F</text>
      <text x="150" y="135" font-family="system-ui, sans-serif" font-size="11" fill="#DCE6DD" text-anchor="middle">HUMIDITY: 44%</text>
      
      <text x="150" y="200" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">HVAC Ambient Guard</text>
      <rect x="80" y="220" width="140" height="30" rx="6" fill="#2c483b"/>
      <text x="150" y="240" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#DCE6DD" text-anchor="middle">NORMAL CYCLE</text>
      <text x="150" y="280" font-family="system-ui, sans-serif" font-size="12" fill="#DCE6DD" text-anchor="middle">Prevents Mold &amp; Pipe Freezes</text>
    </g>
  </g>
`);

// 3. issue-reporting.svg
createSvg('issue-reporting.svg', 800, 600, `
  <rect width="800" height="600" fill="#F8F7F2"/>
  <rect x="40" y="40" width="720" height="520" rx="20" fill="#ffffff" stroke="#DCE6DD" stroke-width="2" filter="url(#dropShadow)"/>
  
  <g transform="translate(80, 80)">
    <text x="0" y="30" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#233247">Immediate Issue Escalation &amp; Resolution</text>
    <text x="0" y="55" font-family="system-ui, sans-serif" font-size="14" fill="#667085">Direct alerts with high-resolution photo proof and vetted contractor access</text>
    
    <!-- Step cards -->
    <g transform="translate(0, 80)">
      <rect width="190" height="320" rx="12" fill="#F8F7F2" stroke="#E9ECEF"/>
      <circle cx="40" cy="40" r="20" fill="#233247"/>
      <text x="40" y="46" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">1</text>
      <text x="24" y="100" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#233247">Observation</text>
      <text x="24" y="130" font-family="system-ui, sans-serif" font-size="13" fill="#475467" line-height="1.5">
        Visual anomaly noted (e.g. fallen branch, tripped breaker, irrigation leak).
      </text>
      <rect x="24" y="240" width="142" height="40" rx="6" fill="#DCE6DD"/>
      <text x="95" y="265" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#233247" text-anchor="middle">Checklist Flagged</text>
    </g>

    <g transform="translate(225, 80)">
      <rect width="190" height="320" rx="12" fill="#F8F7F2" stroke="#E9ECEF"/>
      <circle cx="40" cy="40" r="20" fill="#426B58"/>
      <text x="40" y="46" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">2</text>
      <text x="24" y="100" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#233247">Photo Proof</text>
      <text x="24" y="130" font-family="system-ui, sans-serif" font-size="13" fill="#475467">
        High-resolution photos with timestamp and exact location notes captured.
      </text>
      <rect x="24" y="240" width="142" height="40" rx="6" fill="#426B58"/>
      <text x="95" y="265" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#ffffff" text-anchor="middle">Instant Upload</text>
    </g>

    <g transform="translate(450, 80)">
      <rect width="190" height="320" rx="12" fill="#F8F7F2" stroke="#E9ECEF"/>
      <circle cx="40" cy="40" r="20" fill="#233247"/>
      <text x="40" y="46" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">3</text>
      <text x="24" y="100" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#233247">Owner Alert</text>
      <text x="24" y="130" font-family="system-ui, sans-serif" font-size="13" fill="#475467">
        Homeowner notified immediately via SMS/Dashboard with actionable options.
      </text>
      <rect x="24" y="240" width="142" height="40" rx="6" fill="#DCE6DD"/>
      <text x="95" y="265" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#233247" text-anchor="middle">Zero Delay</text>
    </g>
  </g>
`);

// 4. dashboard-experience.svg
createSvg('dashboard-experience.svg', 800, 600, `
  <rect width="800" height="600" fill="#233247"/>
  <!-- UI Mockup Graphic -->
  <g transform="translate(60, 50)">
    <!-- Dashboard Browser Frame -->
    <rect width="680" height="500" rx="16" fill="#ffffff" filter="url(#dropShadow)"/>
    
    <!-- Window Bar -->
    <rect width="680" height="44" rx="16" fill="#F8F7F2"/>
    <circle cx="30" cy="22" r="6" fill="#d9534f"/>
    <circle cx="48" cy="22" r="6" fill="#f0ad4e"/>
    <circle cx="66" cy="22" r="6" fill="#5cb85c"/>
    <rect x="180" y="10" width="320" height="24" rx="6" fill="#E9ECEF"/>
    <text x="340" y="26" font-family="system-ui, sans-serif" font-size="11" fill="#667085" text-anchor="middle">portal.homewatchcare.com/dashboard</text>
    
    <!-- Sidebar -->
    <g transform="translate(0, 44)">
      <rect width="180" height="456" fill="#233247"/>
      <rect x="20" y="30" width="140" height="32" rx="6" fill="#426B58"/>
      <text x="35" y="51" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#ffffff">Overview</text>
      
      <text x="35" y="100" font-family="system-ui, sans-serif" font-size="12" fill="#DCE6DD">Schedule Visit</text>
      <text x="35" y="140" font-family="system-ui, sans-serif" font-size="12" fill="#DCE6DD">Visit Reports (8)</text>
      <text x="35" y="180" font-family="system-ui, sans-serif" font-size="12" fill="#DCE6DD">Mail Collection</text>
      <text x="35" y="220" font-family="system-ui, sans-serif" font-size="12" fill="#DCE6DD">Key Registry</text>
    </g>

    <!-- Content area -->
    <g transform="translate(200, 60)">
      <text x="0" y="20" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#233247">Ocean Breeze Villa — Check Log</text>
      
      <!-- Summary stats -->
      <g transform="translate(0, 35)">
        <rect width="140" height="80" rx="8" fill="#F8F7F2" stroke="#DCE6DD"/>
        <text x="14" y="25" font-family="system-ui, sans-serif" font-size="11" fill="#667085">Next Visit</text>
        <text x="14" y="50" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#233247">Tomorrow</text>
        <text x="14" y="68" font-family="system-ui, sans-serif" font-size="10" fill="#426B58">10:00 AM Slot</text>
        
        <rect x="155" width="140" height="80" rx="8" fill="#F8F7F2" stroke="#DCE6DD"/>
        <text x="169" y="25" font-family="system-ui, sans-serif" font-size="11" fill="#667085">Property Status</text>
        <text x="169" y="50" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#426B58">All Clear</text>
        <text x="169" y="68" font-family="system-ui, sans-serif" font-size="10" fill="#667085">18 Points Inspected</text>

        <rect x="310" width="140" height="80" rx="8" fill="#F8F7F2" stroke="#DCE6DD"/>
        <text x="324" y="25" font-family="system-ui, sans-serif" font-size="11" fill="#667085">Mail Tracker</text>
        <text x="324" y="50" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#233247">Collected</text>
        <text x="324" y="68" font-family="system-ui, sans-serif" font-size="10" fill="#426B58">Foyer Safe Box</text>
      </g>

      <!-- Recent Report Bar -->
      <g transform="translate(0, 135)">
        <rect width="450" height="150" rx="10" fill="#ffffff" stroke="#E9ECEF"/>
        <text x="20" y="30" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#233247">Latest Inspection Report (Oct 12, 2026)</text>
        
        <g transform="translate(20, 45)">
          <rect width="90" height="75" rx="6" fill="#DCE6DD"/>
          <text x="45" y="42" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#426B58" text-anchor="middle">Ext. Patio</text>
          
          <rect x="105" width="90" height="75" rx="6" fill="#DCE6DD"/>
          <text x="150" y="42" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#426B58" text-anchor="middle">Entry Lock</text>

          <rect x="210" width="90" height="75" rx="6" fill="#DCE6DD"/>
          <text x="255" y="42" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#426B58" text-anchor="middle">Utility Panel</text>
          
          <rect x="315" width="115" height="75" rx="6" fill="#F8F7F2" stroke="#DCE6DD"/>
          <text x="372" y="35" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#233247" text-anchor="middle">Status</text>
          <text x="372" y="55" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#426B58" text-anchor="middle">PASS 100%</text>
        </g>
      </g>
    </g>
  </g>
`);

// 5. contact-concierge.svg
createSvg('contact-concierge.svg', 800, 600, `
  <rect width="800" height="600" fill="#F8F7F2"/>
  <rect x="40" y="40" width="720" height="520" rx="20" fill="#233247"/>
  <g transform="translate(100, 100)">
    <text x="0" y="40" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#ffffff">Dedicated Property Care Concierge</text>
    <text x="0" y="80" font-family="system-ui, sans-serif" font-size="16" fill="#DCE6DD">Your trusted partner on the ground when you are away</text>
    
    <g transform="translate(0, 130)">
      <rect width="280" height="180" rx="12" fill="#1b2738" stroke="#374d6b"/>
      <circle cx="45" cy="45" r="20" fill="#426B58"/>
      <path d="M 38 45 L 43 50 L 52 40" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <text x="80" y="52" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff">Direct Telephone</text>
      <text x="25" y="105" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#DCE6DD">+1 (800) 555-HOME</text>
      <text x="25" y="135" font-family="system-ui, sans-serif" font-size="13" fill="#8d9fb5">Mon – Sun: 7:00 AM – 8:00 PM</text>
    </g>

    <g transform="translate(320, 130)">
      <rect width="280" height="180" rx="12" fill="#1b2738" stroke="#374d6b"/>
      <circle cx="45" cy="45" r="20" fill="#426B58"/>
      <path d="M 37 40 L 53 40 L 45 48 Z" fill="none" stroke="#ffffff" stroke-width="2"/>
      <text x="80" y="52" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff">Dispatch Email</text>
      <text x="25" y="105" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#DCE6DD">care@homewatchservice.com</text>
      <text x="25" y="135" font-family="system-ui, sans-serif" font-size="13" fill="#8d9fb5">Responses within 2 business hours</text>
    </g>
  </g>
`);

// 6. perimeter-check.svg
createSvg('perimeter-check.svg', 800, 600, `
  <rect width="800" height="600" fill="url(#softSage)"/>
  <rect x="40" y="40" width="720" height="520" rx="20" fill="#ffffff" stroke="#DCE6DD" stroke-width="2" filter="url(#dropShadow)"/>
  <g transform="translate(80, 80)">
    <text x="0" y="30" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#233247">Grounds &amp; Perimeter Visual Walkthrough</text>
    <text x="0" y="55" font-family="system-ui, sans-serif" font-size="14" fill="#667085">Fences, gates, pool covers, lighting, irrigation lines, and storm debris</text>
    
    <g transform="translate(0, 90)">
      <rect width="640" height="280" rx="12" fill="#F8F7F2" stroke="#E9ECEF"/>
      <!-- Yard Diagram -->
      <circle cx="120" cy="140" r="70" fill="#DCE6DD" stroke="#426B58" stroke-width="2"/>
      <text x="120" y="145" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#233247" text-anchor="middle">Pool &amp; Deck</text>
      
      <rect x="230" y="70" width="180" height="140" rx="8" fill="#233247"/>
      <text x="320" y="145" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">Main Residence</text>

      <circle cx="510" cy="140" r="60" fill="#DCE6DD" stroke="#426B58" stroke-width="2"/>
      <text x="510" y="145" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#233247" text-anchor="middle">Gates &amp; Driveway</text>
      
      <!-- Walkthrough route line -->
      <path d="M 80 230 C 180 240, 280 240, 560 230" fill="none" stroke="#426B58" stroke-width="3" stroke-dasharray="6 6"/>
      <text x="320" y="260" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#426B58" text-anchor="middle">360° Exterior Foot Patrol Route</text>
    </g>
  </g>
`);

// 7. Report Sample Photos for Gallery & Dashboard
createSvg('report-sample-1.svg', 600, 450, `
  <rect width="600" height="450" fill="#233247"/>
  <!-- Image frame representation -->
  <rect x="20" y="20" width="560" height="410" rx="12" fill="#1b2738" stroke="#374d6b"/>
  <!-- Patio garden view -->
  <path d="M 20 280 L 180 180 L 340 260 L 480 160 L 580 230 L 580 430 L 20 430 Z" fill="#2d4a3b"/>
  <rect x="20" y="320" width="560" height="110" fill="#3e6451"/>
  <!-- Pool deck line -->
  <rect x="80" y="340" width="440" height="70" rx="8" fill="#5a9177"/>
  <text x="300" y="380" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Patio &amp; Rear Exterior Walkway</text>
  <!-- Timestamp badge -->
  <rect x="40" y="40" width="220" height="32" rx="6" fill="#000000" opacity="0.75"/>
  <text x="50" y="61" font-family="monospace" font-size="12" fill="#22c55e">● 2026-10-12 10:14:22 EST</text>
  <!-- Status badge -->
  <rect x="440" y="40" width="120" height="32" rx="6" fill="#22c55e"/>
  <text x="500" y="61" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">VERIFIED OK</text>
`);

createSvg('report-sample-2.svg', 600, 450, `
  <rect width="600" height="450" fill="#233247"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="#1b2738" stroke="#374d6b"/>
  <!-- Front Entry Door graphic -->
  <rect x="180" y="100" width="240" height="330" rx="6" fill="#2c3e56"/>
  <rect x="200" y="120" width="95" height="130" rx="4" fill="#3a5170"/>
  <rect x="305" y="120" width="95" height="130" rx="4" fill="#3a5170"/>
  <rect x="200" y="270" width="95" height="140" rx="4" fill="#3a5170"/>
  <rect x="305" y="270" width="95" height="140" rx="4" fill="#3a5170"/>
  <!-- Lock deadbolt -->
  <circle cx="215" cy="275" r="8" fill="#ffd166"/>
  <circle cx="215" cy="275" r="4" fill="#233247"/>
  <!-- Timestamp -->
  <rect x="40" y="40" width="220" height="32" rx="6" fill="#000000" opacity="0.75"/>
  <text x="50" y="61" font-family="monospace" font-size="12" fill="#22c55e">● 2026-10-12 10:22:05 EST</text>
  <rect x="440" y="40" width="120" height="32" rx="6" fill="#22c55e"/>
  <text x="500" y="61" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">LOCKED &amp; SECURE</text>
  <text x="300" y="420" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Main Entry Double Doors &amp; Deadbolts</text>
`);

createSvg('report-sample-3.svg', 600, 450, `
  <rect width="600" height="450" fill="#233247"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="#1b2738" stroke="#374d6b"/>
  <!-- Utility area graphic -->
  <rect x="120" y="100" width="150" height="280" rx="8" fill="#3a5170"/>
  <rect x="140" y="120" width="110" height="40" rx="4" fill="#233247"/>
  <text x="195" y="145" font-family="monospace" font-size="16" fill="#22c55e" text-anchor="middle">0.00 GPM</text>
  <circle cx="195" cy="240" r="30" fill="none" stroke="#ffd166" stroke-width="6"/>
  <!-- Pipes -->
  <rect x="320" y="80" width="20" height="320" fill="#5a738e"/>
  <rect x="380" y="80" width="20" height="320" fill="#5a738e"/>
  <!-- Timestamp -->
  <rect x="40" y="40" width="220" height="32" rx="6" fill="#000000" opacity="0.75"/>
  <text x="50" y="61" font-family="monospace" font-size="12" fill="#22c55e">● 2026-10-12 10:35:40 EST</text>
  <rect x="440" y="40" width="120" height="32" rx="6" fill="#22c55e"/>
  <text x="500" y="61" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">ZERO LEAKS</text>
  <text x="300" y="420" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Water Meter &amp; Main Supply Valve</text>
`);

createSvg('report-sample-4.svg', 600, 450, `
  <rect width="600" height="450" fill="#233247"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="#1b2738" stroke="#374d6b"/>
  <!-- Mail in tray -->
  <rect x="150" y="160" width="300" height="180" rx="10" fill="#426B58"/>
  <rect x="170" y="140" width="220" height="130" rx="4" fill="#F8F7F2" stroke="#DCE6DD" stroke-width="2"/>
  <text x="280" y="210" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#233247" text-anchor="middle">Collected Mail Safe Tray</text>
  <!-- Timestamp -->
  <rect x="40" y="40" width="220" height="32" rx="6" fill="#000000" opacity="0.75"/>
  <text x="50" y="61" font-family="monospace" font-size="12" fill="#22c55e">● 2026-10-12 10:48:12 EST</text>
  <rect x="440" y="40" width="120" height="32" rx="6" fill="#22c55e"/>
  <text x="500" y="61" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">COLLECTED</text>
  <text x="300" y="420" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Foyer Stored Mail (2 Envelopes)</text>
`);

console.log('All local SVG image assets generated successfully!');

