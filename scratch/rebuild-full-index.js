const fs = require('fs');

const lines = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

const lineMap = new Map();

for (let i = 0; i < lines.length; i++) {
  try {
    const res = JSON.parse(lines[i]);
    const text = res.content || '';
    if (text.includes('File Path:') && text.includes('index.html')) {
      const textLines = text.split('\n');
      for (const tl of textLines) {
        const lm = tl.match(/^(\d+):\s?(.*)$/);
        if (lm) {
          lineMap.set(parseInt(lm[1]), lm[2]);
        }
      }
    }
  } catch (e) {}
}

// Lines 1 to 240 from transcript
let fullContent = [];
for (let i = 1; i <= 240; i++) {
  if (lineMap.has(i)) {
    fullContent.push(lineMap.get(i));
  }
}

// Section 3 (lines 241 to 329):
const section3 = `
    <!-- SECTION 3: Core Home Watch Services (Cards with Visuals) -->
    <section class="section section-muted" id="core-services-section">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">What We Do</span>
          <h2 class="section-title">Core Home Watch Services</h2>
          <p class="section-subtitle">
            Focused, systematic inspection routines designed to keep your absentee luxury residence immaculate and secure.
          </p>
        </div>

        <div class="cards-grid-4">
          <!-- Service 1 -->
          <article class="card card-service">
            <img src="assets/images/service-inspection.jpg" alt="Visual Interior & Exterior Inspections" class="card-img-top" loading="lazy">
            <div class="card-body">
              <h3 class="card-title">Visual Walkthroughs</h3>
              <p class="card-text">
                Systematic room-by-room physical inspections covering ceilings, windows, mechanical rooms, faucets, and perimeter walls.
              </p>
              <div class="card-action">
                <a href="services.html#visual-checks" class="btn btn-secondary btn-sm btn-block">Learn More</a>
              </div>
            </div>
          </article>

          <!-- Service 2 -->
          <article class="card card-service">
            <img src="assets/images/service-doors-windows.jpg" alt="Doors, Windows & Perimeter Checks" class="card-img-top" loading="lazy">
            <div class="card-body">
              <h3 class="card-title">Doors &amp; Windows</h3>
              <p class="card-text">
                Verifying that every exterior door deadbolt, sliding patio latch, and ground-floor window remains securely locked and sealed.
              </p>
              <div class="card-action">
                <a href="services.html#doors-windows" class="btn btn-secondary btn-sm btn-block">Learn More</a>
              </div>
            </div>
          </article>

          <!-- Service 3 -->
          <article class="card card-service">
            <img src="assets/images/mail-collection.jpg" alt="Mail, Package & Delivery Collection" class="card-img-top" loading="lazy">
            <div class="card-body">
              <h3 class="card-title">Mail &amp; Deliveries</h3>
              <p class="card-text">
                Collecting porch deliveries, flyers, and postal mail so your property never projects an obvious unoccupied appearance.
              </p>
              <div class="card-action">
                <a href="services.html#mail-handling" class="btn btn-secondary btn-sm btn-block">Learn More</a>
              </div>
            </div>
          </article>

          <!-- Service 4 -->
          <article class="card card-service">
            <img src="assets/images/issue-reporting.jpg" alt="Photo-Documented Issue Reporting" class="card-img-top" loading="lazy">
            <div class="card-body">
              <h3 class="card-title">Issue Reporting</h3>
              <p class="card-text">
                Rapid communication with high-resolution photographic proof when weather events or utility anomalies require attention.
              </p>
              <div class="card-action">
                <a href="services.html#issue-reporting" class="btn btn-secondary btn-sm btn-block">Learn More</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>`;

fullContent.push(...section3.trim().split('\n'));

// Lines 340 to 570 from transcript
for (let i = 340; i <= 570; i++) {
  if (lineMap.has(i)) {
    fullContent.push(lineMap.get(i));
  }
}

// Replace SVG images with our HD images:
let fileText = fullContent.join('\n')
  .replace(/assets\/images\/mail-collection\.svg/g, 'assets/images/mail-collection.jpg')
  .replace(/assets\/images\/issue-reporting\.svg/g, 'assets/images/issue-reporting.jpg')
  .replace(/assets\/images\/dashboard-experience\.svg/g, 'assets/images/dashboard-experience.jpg');

// Ensure standard closing tags if needed
if (!fileText.includes('</html>')) {
  fileText += '\n</body>\n</html>\n';
}

fs.writeFileSync('index.html', fileText, 'utf8');
console.log('✓ Successfully wrote complete index.html! Length:', fileText.length, 'lines:', fileText.split('\n').length);
