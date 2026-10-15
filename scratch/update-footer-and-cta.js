const fs = require('fs');

const SOCIAL_ICONS_HTML = `          <!-- Social Media Icons -->
          <div class="footer-social-links" aria-label="HavenGuard Social Profiles">
            <a href="https://instagram.com" class="social-icon-btn" aria-label="HavenGuard on Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://facebook.com" class="social-icon-btn" aria-label="HavenGuard on Facebook" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://linkedin.com" class="social-icon-btn" aria-label="HavenGuard on LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://twitter.com" class="social-icon-btn" aria-label="HavenGuard on X" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="https://youtube.com" class="social-icon-btn" aria-label="HavenGuard on YouTube" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>`;

const COMPLETE_FOOTER_BRAND = `        <!-- Brand Column -->
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
${SOCIAL_ICONS_HTML}
        </div>`;

const pages = ['index.html', 'home-2.html', 'services.html', 'about.html', 'contact.html'];

pages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove style="padding-block-end: 0;" from the CTA section
  content = content.replace(/\s*style="padding-block-end:\s*0;?"/g, '');

  // 2. Replace the footer-brand div entirely
  // Match from <div class="footer-brand"> up to the next sibling column <div>
  const footerBrandRegex = /(?:<!-- Brand Column -->\s*)?<div class="footer-brand">[\s\S]*?<\/div>(\s*<!-- Navigation Links -->|\s*<div>\s*<h4 class="footer-heading">Pages<\/h4>)/;
  
  if (footerBrandRegex.test(content)) {
    content = content.replace(footerBrandRegex, `${COMPLETE_FOOTER_BRAND}\n\n        $1`);
    console.log(`Updated footer-brand and CTA in ${file}`);
  } else {
    console.warn(`Could not match footer-brand in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
});
