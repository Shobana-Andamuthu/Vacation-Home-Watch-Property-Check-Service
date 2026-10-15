/**
 * VACATION HOME WATCH & PROPERTY CHECK SERVICE
 * Contact Form Validation & Submission Handler
 */

(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const alertBox = document.getElementById('contact-alert');

      // Fields
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const locationInput = document.getElementById('contact-location');
      const messageInput = document.getElementById('contact-message');
      const enquiryType = document.getElementById('contact-type').value;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // Validate Location
      if (!locationInput.value.trim() || locationInput.value.trim().length < 3) {
        locationInput.classList.add('is-invalid');
        isValid = false;
      } else {
        locationInput.classList.remove('is-invalid');
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.classList.add('is-invalid');
        isValid = false;
      } else {
        messageInput.classList.remove('is-invalid');
      }

      if (!isValid) {
        if (alertBox) {
          alertBox.className = 'form-feedback-alert alert-danger show';
          alertBox.textContent = 'Please correct the highlighted fields with required information.';
        }
        return;
      }

      // Valid: Display realistic demo submission confirmation
      if (alertBox) {
        alertBox.className = 'form-feedback-alert alert-success show';
        alertBox.innerHTML = `
          <strong>Thank you, ${nameInput.value.trim()}!</strong><br>
          Your property care enquiry regarding <strong>"${enquiryType}"</strong> at <strong>${locationInput.value.trim()}</strong> has been recorded in our concierge demo intake.<br>
          <span style="font-size: 0.88rem; opacity: 0.9; margin-top: 0.5rem; display: inline-block;">
            Our property team will review your requirements and respond within 24 business hours. (Note: Production deployment connects to automated SMTP/CRM dispatch).
          </span>
        `;
      }

      form.reset();
      // Remove any lingering invalid classes
      [nameInput, emailInput, locationInput, messageInput].forEach(el => el.classList.remove('is-invalid'));
    });
  }

  document.addEventListener('DOMContentLoaded', initContactForm);
})();
