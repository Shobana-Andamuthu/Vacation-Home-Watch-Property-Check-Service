const fs = require('fs');
const path = require('path');

const PRELOADER_HTML = `  <!-- Page Preloader -->
  <div id="page-preloader" class="page-preloader" aria-hidden="true">
    <div class="preloader-content">
      <div class="preloader-shield-wrap">
        <img src="assets/images/havenguard-shield-icon.png" alt="HavenGuard" class="preloader-shield" width="68" height="68">
        <div class="preloader-pulse-ring"></div>
      </div>
      <div class="preloader-brand">
        <span class="preloader-title">HavenGuard</span>
        <span class="preloader-tagline">Your Home. Our Watch.</span>
      </div>
      <div class="preloader-progress-track">
        <div class="preloader-progress-bar"></div>
      </div>
    </div>
  </div>
`;

const FAVICON_HTML = `  <link rel="icon" type="image/png" href="assets/images/favicon.png">`;

const BRAND_NAV_HTML = `      <!-- Logo -->
      <a href="index.html" class="nav-brand" id="brand-logo" aria-label="HavenGuard - Your Home. Our Watch.">
        <img src="assets/images/havenguard-shield-icon.png" alt="HavenGuard Shield Logo" class="brand-logo-shield" width="38" height="38">
        <div class="brand-title-group">
          <span class="brand-name">HavenGuard</span>
          <span class="brand-tagline">Your Home. Our Watch.</span>
        </div>
      </a>`;

const BRAND_DRAWER_HTML = `      <a href="index.html" class="nav-brand" aria-label="HavenGuard Home">
        <img src="assets/images/havenguard-shield-icon.png" alt="HavenGuard Shield Logo" class="brand-logo-shield" width="34" height="34">
        <div class="brand-title-group">
          <span class="brand-name">HavenGuard</span>
          <span class="brand-tagline">Your Home. Our Watch.</span>
        </div>
      </a>`;

const BRAND_FOOTER_HTML = `        <!-- Brand Column -->
        <div class="footer-brand">
          <a href="index.html" class="nav-brand footer-brand-logo" style="margin-block-end: 1rem; color: #FFFFFF; text-decoration: none;">
            <img src="assets/images/havenguard-shield-icon.png" alt="HavenGuard Shield Logo" class="brand-logo-shield" width="38" height="38">
            <div class="brand-title-group">
              <span class="brand-name" style="color: #FFFFFF;">HavenGuard</span>
              <span class="brand-tagline" style="color: var(--color-sage);">Your Home. Our Watch.</span>
            </div>
          </a>
          <p>
            Premier vacation home watch and visual property care service for secondary residences, coastal villas, and luxury estates.
          </p>
          <div style="margin-block-start: 1.25rem; font-size: 0.88rem; color: var(--color-sage);">
            Bonded &amp; Insured Care Specialists
          </div>
        </div>`;

const files = ['index.html', 'home-2.html', 'services.html', 'about.html', 'contact.html', 'login.html', 'dashboard.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add favicon if not present
  if (!content.includes('rel="icon"')) {
    content = content.replace('<link rel="stylesheet" href="assets/css/style.css">', `${FAVICON_HTML}\n  <link rel="stylesheet" href="assets/css/style.css">`);
  }

  // 2. Add preloader right after <body> or <body ...>
  if (!content.includes('id="page-preloader"')) {
    content = content.replace(/(<body[^>]*>)/i, `$1\n\n${PRELOADER_HTML}`);
  }

  // 3. Update navbar brand
  if (file === 'dashboard.html') {
    // Dashboard has brand-portal-tag
    const dashBrandRegex = /<a href="index\.html" class="nav-brand" id="brand-logo"[\s\S]*?<\/a>/;
    const dashBrandReplacement = `<a href="index.html" class="nav-brand" id="brand-logo" aria-label="HavenGuard Home">
          <img src="assets/images/havenguard-shield-icon.png" alt="HavenGuard Shield Logo" class="brand-logo-shield" width="38" height="38">
          <div class="brand-title-group">
            <span class="brand-name">HavenGuard <span class="brand-portal-tag" style="font-size: 0.8rem; font-weight: 500; opacity: 0.8; margin-inline-start: 0.25rem;">Portal</span></span>
            <span class="brand-tagline">Your Home. Our Watch.</span>
          </div>
        </a>`;
    content = content.replace(dashBrandRegex, dashBrandReplacement);
  } else {
    // Standard pages navbar brand
    const navBrandRegex = /<!-- Logo -->\s*<a href="index\.html" class="nav-brand" id="brand-logo"[\s\S]*?<\/a>/;
    if (navBrandRegex.test(content)) {
      content = content.replace(navBrandRegex, BRAND_NAV_HTML);
    } else {
      // Fallback for login or other pages
      const genericNavBrand = /<a href="index\.html" class="nav-brand" id="brand-logo"[\s\S]*?<\/a>/;
      content = content.replace(genericNavBrand, BRAND_NAV_HTML);
    }
  }

  // 4. Update mobile drawer brand (in pages with mobile-nav-header)
  const drawerBrandRegex = /<div class="mobile-nav-header">\s*<a href="index\.html" class="nav-brand"[\s\S]*?<\/a>/;
  if (drawerBrandRegex.test(content)) {
    content = content.replace(drawerBrandRegex, `<div class="mobile-nav-header">\n${BRAND_DRAWER_HTML}`);
  }

  // 5. Update footer brand (in pages with footer-brand)
  const footerBrandRegex = /<!-- Brand Column -->\s*<div class="footer-brand">[\s\S]*?<\/div>\s*<\/div>/;
  if (footerBrandRegex.test(content)) {
    content = content.replace(footerBrandRegex, BRAND_FOOTER_HTML);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
