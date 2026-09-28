/**
 * Aboli Awatade - Professional Portfolio Interactions
 * Features: Dark/Light Mode, Mobile Navigation, Scroll Spy,
 * Project Filtering, Clipboard Utilities, and Accessible Focus.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light Mode)
  // -------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const htmlRoot = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('aboli_portfolio_theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlRoot.setAttribute('data-theme', 'dark');
      localStorage.setItem('aboli_portfolio_theme', 'dark');
    } else {
      htmlRoot.removeAttribute('data-theme');
      localStorage.setItem('aboli_portfolio_theme', 'light');
    }
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  // Listen to theme toggle buttons
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Sticky Header Elevation on Scroll
  // -------------------------------------------------------------------------
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileNav() {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function openMobileNav() {
    navToggle.classList.add('open');
    mobileNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMobileNav() {
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', toggleMobileNav);

    // Close when clicking any nav link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close with Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
    });

    // Close if window resized past mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Scroll Spy (Active Navigation Indicator)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        mobileLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // -------------------------------------------------------------------------
  // 5. Featured Projects Filter
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. Copy Email to Clipboard Utility
  // -------------------------------------------------------------------------
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');

  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'aboliawatade0615@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showCopiedState(btn);
        }).catch(() => {
          fallbackCopyText(email, btn);
        });
      } else {
        fallbackCopyText(email, btn);
      }
    });
  });

  function showCopiedState(btn) {
    btn.classList.add('copied');
    const tooltip = btn.querySelector('.tooltip');
    if (tooltip) tooltip.textContent = 'Copied to clipboard!';

    setTimeout(() => {
      btn.classList.remove('copied');
      if (tooltip) tooltip.textContent = 'Copy Email';
    }, 2200);
  }

  function fallbackCopyText(text, btn) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showCopiedState(btn);
    } catch (err) {
      window.location.href = `mailto:${text}`;
    }
    document.body.removeChild(tempInput);
  }

  // -------------------------------------------------------------------------
  // 7. Contact Form Handler (Direct Mailto Composer)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');
      const feedback = document.getElementById('formFeedback');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'Software Developer Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      const bodyText = encodeURIComponent(
        `Hello Aboli,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form`
      );

      const mailtoUrl = `mailto:aboliawatade0615@gmail.com?subject=${encodeURIComponent(subject)}&body=${bodyText}`;

      // Open email client
      window.location.href = mailtoUrl;

      // Show friendly confirmation
      if (feedback) {
        feedback.textContent = 'Thank you! Your default email client has been opened with your message ready to send.';
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
      }

      contactForm.reset();
    });
  }

  // -------------------------------------------------------------------------
  // 8. Resume Preview Modal
  // -------------------------------------------------------------------------
  const resumeModal = document.getElementById('resumeModal');
  const viewResumeBtns = document.querySelectorAll('.btn-view-resume');
  const closeResumeBtns = document.querySelectorAll('.btn-close-resume');
  const printResumeBtn = document.getElementById('btnPrintResume');

  function openResumeModal() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      const mobileNav = document.querySelector('.mobile-nav');
      if (!mobileNav || !mobileNav.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }
  }

  viewResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  closeResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeResumeModal();
    });
  });

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      const iframe = document.getElementById('resumeIframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          return;
        } catch (err) {
          // fallback
        }
      }
      window.open('resume.html', '_blank');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('open')) {
      closeResumeModal();
    }
  });

})();
