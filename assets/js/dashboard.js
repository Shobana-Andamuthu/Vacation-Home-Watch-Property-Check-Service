/**
 * VACATION HOME WATCH & PROPERTY CHECK SERVICE
 * Dashboard Controller: Scheduling, Reports Gallery Modal, Mail Tracking, LocalStorage
 */

(function () {
  'use strict';

  const STORAGE_SCHEDULE_KEY = 'homewatch_scheduled_visits';
  const STORAGE_MAIL_KEY = 'homewatch_mail_status';

  // Seed default data if none exists
  const DEFAULT_VISITS = [
    {
      id: 'V-1092',
      property: 'Ocean Breeze Villa',
      date: '2026-10-18',
      timeSlot: 'Morning (09:00 - 12:00)',
      notes: 'Check HVAC filters, run guest bathroom faucets, verify porch light timer.',
      status: 'Upcoming'
    },
    {
      id: 'V-1088',
      property: 'Ocean Breeze Villa',
      date: '2026-10-12',
      timeSlot: 'Morning (10:00 - 11:30)',
      notes: 'Routine bi-weekly check. Water lines flushed, all entry deadbolts inspected.',
      status: 'Completed'
    },
    {
      id: 'V-1075',
      property: 'Highland Mountain Lodge',
      date: '2026-09-28',
      timeSlot: 'Afternoon (13:00 - 15:00)',
      notes: 'Pre-storm perimeter check. Gutters cleared, outdoor furniture secured.',
      status: 'Completed'
    }
  ];

  const REPORT_DATA = [
    {
      id: 'R-2026-1012',
      property: 'Ocean Breeze Villa',
      date: 'October 12, 2026',
      time: '10:14 AM - 11:15 AM EST',
      status: 'All Systems Normal',
      inspector: 'Marcus Vance, Certified Home Watch Inspector',
      notes: 'No signs of water infiltration, pests, or unauthorized access. All windows and patio doors firmly locked. Main water valve tested. Mailbox emptied and mail secured in foyer.',
      photos: [
        { src: 'assets/images/report-sample-1.jpg', title: 'Rear Patio & Perimeter Walkway', status: 'Passed' },
        { src: 'assets/images/report-sample-2.jpg', title: 'Main Entry Doors & Deadbolts', status: 'Secure' },
        { src: 'assets/images/report-sample-3.jpg', title: 'Utility Meter & Main Water Valve', status: 'Zero Leaks' },
        { src: 'assets/images/report-sample-4.jpg', title: 'Collected Mail Safe Storage', status: 'Collected' }
      ]
    },
    {
      id: 'R-2026-0928',
      property: 'Highland Mountain Lodge',
      date: 'September 28, 2026',
      time: '01:10 PM - 02:40 PM EST',
      status: 'Weather Preparation Complete',
      inspector: 'Elena Rostova, Property Care Specialist',
      notes: 'Exterior deck inspection clear. Branch clearance verified. Breaker panel inspected with normal readings. Thermostat verified at 68°F.',
      photos: [
        { src: 'assets/images/report-sample-5.jpg', title: 'Exterior Deck & Trellis', status: 'Clear' },
        { src: 'assets/images/report-sample-6.jpg', title: 'HVAC & Ambient Thermostat', status: 'Optimal' }
      ]
    }
  ];

  function getScheduledVisits() {
    const raw = localStorage.getItem(STORAGE_SCHEDULE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(DEFAULT_VISITS));
      return DEFAULT_VISITS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_VISITS;
    }
  }

  function getMailStatus() {
    return localStorage.getItem(STORAGE_MAIL_KEY) || 'Collected';
  }

  function setMailStatus(newStatus) {
    localStorage.setItem(STORAGE_MAIL_KEY, newStatus);
    renderMailStatus();
    renderSummaryCards();
  }

  function renderSummaryCards() {
    const visits = getScheduledVisits();
    const upcoming = visits.filter(v => v.status === 'Upcoming');
    const completed = visits.filter(v => v.status === 'Completed');

    // Next Scheduled Visit
    const nextVisitEl = document.getElementById('summary-next-visit');
    const nextDateEl = document.getElementById('summary-next-date');
    if (nextVisitEl && nextDateEl) {
      if (upcoming.length > 0) {
        nextVisitEl.textContent = upcoming[0].date;
        nextDateEl.textContent = `${upcoming[0].property} (${upcoming[0].timeSlot.split(' ')[0]})`;
      } else {
        nextVisitEl.textContent = 'None Scheduled';
        nextDateEl.textContent = 'Tap Schedule to book a check';
      }
    }

    // Completed Visits
    const completedCountEl = document.getElementById('summary-completed-count');
    if (completedCountEl) {
      completedCountEl.textContent = `${completed.length} Visits`;
    }

    // Mail status
    const mailStatusEl = document.getElementById('summary-mail-status');
    const mailSubtextEl = document.getElementById('summary-mail-subtext');
    if (mailStatusEl) {
      const currentMail = getMailStatus();
      mailStatusEl.textContent = currentMail;
      if (mailSubtextEl) {
        if (currentMail === 'Collected') {
          mailSubtextEl.textContent = 'Stored in Foyer Safe Box';
        } else if (currentMail === 'Awaiting Collection') {
          mailSubtextEl.textContent = 'Scheduled for next inspection';
        } else {
          mailSubtextEl.textContent = 'Receptacle checked; empty';
        }
      }
    }
  }

  function renderVisitsList() {
    const tableBody = document.getElementById('visits-table-body');
    if (!tableBody) return;

    const visits = getScheduledVisits();
    tableBody.innerHTML = '';

    visits.forEach(v => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 1rem; border-block-end: 1px solid var(--border-light); font-weight: 600;">
          ${v.property}
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">ID: ${v.id}</div>
        </td>
        <td style="padding: 1rem; border-block-end: 1px solid var(--border-light);">${v.date}</td>
        <td style="padding: 1rem; border-block-end: 1px solid var(--border-light); font-size: 0.9rem;">${v.timeSlot}</td>
        <td style="padding: 1rem; border-block-end: 1px solid var(--border-light);">
          <span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; ${
            v.status === 'Completed'
              ? 'background-color: rgba(46, 125, 50, 0.12); color: var(--color-success);'
              : 'background-color: rgba(66, 107, 88, 0.15); color: var(--color-forest);'
          }">
            ${v.status}
          </span>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function renderMailStatus() {
    const currentMail = getMailStatus();
    const mailSelect = document.getElementById('mail-status-select');
    if (mailSelect) {
      mailSelect.value = currentMail;
    }
    const indicator = document.getElementById('mail-badge-indicator');
    if (indicator) {
      indicator.textContent = currentMail;
    }
  }

  function setupSchedulingForm() {
    const form = document.getElementById('schedule-visit-form');
    if (!form) return;

    // Set minimum date to today
    const dateInput = document.getElementById('visit-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const property = document.getElementById('visit-property').value;
      const date = document.getElementById('visit-date').value;
      const timeSlot = document.getElementById('visit-slot').value;
      const notes = document.getElementById('visit-notes').value.trim();

      const alertBox = document.getElementById('schedule-alert');

      if (!property || !date || !timeSlot) {
        if (alertBox) {
          alertBox.className = 'form-feedback-alert alert-danger show';
          alertBox.textContent = 'Please fill out all required fields before scheduling.';
        }
        return;
      }

      // Record visit
      const visits = getScheduledVisits();
      const newVisit = {
        id: 'V-' + Math.floor(1000 + Math.random() * 9000),
        property: property,
        date: date,
        timeSlot: timeSlot,
        notes: notes || 'Standard 18-point property check.',
        status: 'Upcoming'
      };

      // Add to start
      visits.unshift(newVisit);
      localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(visits));

      if (alertBox) {
        alertBox.className = 'form-feedback-alert alert-success show';
        alertBox.innerHTML = `<strong>Visit Request Confirmed!</strong> (Interactive Demo: saved locally in browser). Your property check for <strong>${property}</strong> on <strong>${date}</strong> (${timeSlot}) has been added to your queue.`;
      }

      form.reset();
      renderSummaryCards();
      renderVisitsList();

      setTimeout(() => {
        if (alertBox) alertBox.classList.remove('show');
      }, 6000);
    });
  }

  function setupMailControls() {
    const mailSelect = document.getElementById('mail-status-select');
    if (mailSelect) {
      mailSelect.addEventListener('change', function () {
        setMailStatus(this.value);
        const feedback = document.getElementById('mail-feedback');
        if (feedback) {
          feedback.textContent = `Status updated to "${this.value}" (Saved in Demo Storage).`;
          feedback.style.display = 'block';
          setTimeout(() => { feedback.style.display = 'none'; }, 3000);
        }
      });
    }
  }

  // --- Modal Gallery Viewer ---
  function openReportModal(reportId) {
    const modal = document.getElementById('report-detail-modal');
    if (!modal) return;

    const report = REPORT_DATA.find(r => r.id === reportId) || REPORT_DATA[0];

    document.getElementById('modal-report-title').textContent = `${report.property} — Visit Report`;
    document.getElementById('modal-report-date').textContent = `${report.date} | ${report.time}`;
    document.getElementById('modal-report-inspector').textContent = `Conducted by: ${report.inspector}`;
    document.getElementById('modal-report-status').textContent = report.status;
    document.getElementById('modal-report-notes').textContent = report.notes;

    const photosContainer = document.getElementById('modal-report-photos');
    if (photosContainer) {
      photosContainer.innerHTML = '';
      report.photos.forEach(photo => {
        const item = document.createElement('div');
        item.style.cssText = 'background: var(--bg-subtle); border-radius: 8px; overflow: hidden; border: 1px solid var(--border-subtle);';
        item.innerHTML = `
          <img src="${photo.src}" alt="${photo.title}" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;">
          <div style="padding: 0.75rem;">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${photo.title}</div>
            <div style="font-size: 0.8rem; color: var(--color-forest); font-weight: 600; margin-top: 0.25rem;">Status: ${photo.status}</div>
          </div>
        `;
        photosContainer.appendChild(item);
      });
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeReportModal() {
    const modal = document.getElementById('report-detail-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function setupModals() {
    document.querySelectorAll('.js-open-report').forEach(btn => {
      btn.addEventListener('click', function () {
        const reportId = this.getAttribute('data-report-id') || 'R-2026-1012';
        openReportModal(reportId);
      });
    });

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeReportModal);
    }

    const modal = document.getElementById('report-detail-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeReportModal();
        }
      });
    }
  }

  // --- View Switcher in Dashboard ---
  function setupViewTabs() {
    const navButtons = document.querySelectorAll('.dashboard-nav-item button');
    const sections = document.querySelectorAll('.dashboard-view-section');

    navButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const targetView = this.getAttribute('data-target-view');

        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        sections.forEach(sec => {
          if (sec.id === targetView) {
            sec.style.display = 'block';
          } else {
            sec.style.display = 'none';
          }
        });

        // Close sidebar on mobile/tablet after selection
        if (window.innerWidth <= 1200) {
          closeSidebar();
        }
      });
    });

    // Mobile/Tablet sidebar toggle and backdrop
    const toggleBtn = document.getElementById('dashboard-sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const backdrop = document.getElementById('dashboard-sidebar-backdrop');

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      if (toggleBtn) {
        toggleBtn.classList.add('is-active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.setAttribute('aria-label', 'Close navigation sidebar');
      }
      if (window.innerWidth <= 1200) {
        document.body.style.overflow = 'hidden';
      }
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      if (toggleBtn) {
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Open navigation sidebar');
      }
      document.body.style.overflow = '';
    }

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    const drawerCloseBtn = document.getElementById('sidebar-drawer-close');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeSidebar);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderSummaryCards();
    renderVisitsList();
    renderMailStatus();
    setupSchedulingForm();
    setupMailControls();
    setupModals();
    setupViewTabs();
  });

  window.DashboardApp = {
    openReportModal,
    closeReportModal,
    setMailStatus
  };
})();
