/* ============================================
   莫特普迩新材料 - 交互脚本
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ========== Navbar scroll effect ==========
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ========== Mobile menu toggle ==========
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navbarEl = document.querySelector('.navbar');
  if (toggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
      // Close all open dropdowns on mobile
      navLinks.querySelectorAll('.nav__item--open').forEach(item => {
        item.classList.remove('nav__item--open');
      });
    };

    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
          // Close all open dropdowns when closing menu
          navLinks.querySelectorAll('.nav__item--open').forEach(item => {
            item.classList.remove('nav__item--open');
          });
        }
      }
    });

    // Handle nav item clicks on mobile
    navLinks.querySelectorAll('.nav__item').forEach(item => {
      const parentLink = item.querySelector('.nav__link');
      if (parentLink) {
        parentLink.addEventListener('click', (e) => {
          // On mobile, toggle dropdown instead of navigating
          if (window.innerWidth <= 968) {
            e.preventDefault();
            // Close other open items
            navLinks.querySelectorAll('.nav__item--open').forEach(openItem => {
              if (openItem !== item) {
                openItem.classList.remove('nav__item--open');
              }
            });
            item.classList.toggle('nav__item--open');
          }
          // On desktop, let the link navigate normally
        });
      }
    });

    // Regular nav link clicks (non-dropdown items) close menu
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      const parentItem = link.closest('.nav__item');
      if (!parentItem) {
        link.addEventListener('click', closeMenu);
      }
    });

    // Dropdown sub-link clicks close menu on mobile
    navLinks.querySelectorAll('.nav__dropdown-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && navbarEl && !navbarEl.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 968) {
          closeMenu();
        }
      }, 150);
    });
  }

  // ========== Active nav link ==========
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    // Strip anchor for comparison
    const hrefPage = href.split('#')[0];
    if (hrefPage === currentPage || (currentPage === '' && hrefPage === 'index.html')) {
      link.classList.add('active');
      // Also highlight parent nav__item if exists
      const parentItem = link.closest('.nav__item');
      if (parentItem) {
        parentItem.classList.add('nav__item--active');
      }
    }
  });

  // ========== Scroll reveal animations ==========
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });

  // ========== Contact form handling ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> 提交成功！';
        btn.style.background = '#2E7D32';

        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 2500);

        // Show success message
        const msg = document.createElement('div');
        msg.style.cssText = `
          position: fixed; top: 90px; left: 50%; transform: translateX(-50%);
          background: #0D3B16; color: #fff; padding: 1rem 2rem;
          border-radius: 8px; z-index: 9999; font-size: 0.9375rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2); opacity: 0;
          transition: opacity 0.3s ease; max-width: calc(100% - 2rem); text-align: center;
        `;
        msg.innerHTML = '<i class="fas fa-check-circle" style="color:#7BB32D;margin-right:0.5rem;"></i>感谢您的留言，我们将尽快与您联系！';
        document.body.appendChild(msg);

        requestAnimationFrame(() => {
          msg.style.opacity = '1';
        });

        setTimeout(() => {
          msg.style.opacity = '0';
          setTimeout(() => msg.remove(), 300);
        }, 3000);
      }, 1200);
    });
  }

  // ========== Smooth anchor scroll ==========
  document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const targetId = href.substring(hashIndex);
      if (!targetId || targetId === '#') return;

      const pathPart = href.substring(0, hashIndex);
      if (pathPart) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (pathPart !== currentPage) return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const subnavHeight = document.querySelector('.subnav') ? 48 : 0;
        const offset = 72 + subnavHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== Subnav Scroll Spy ==========
  if (subnav) {
    const subnavLinks = subnav.querySelectorAll('.subnav__link');
    const sectionIds = Array.from(subnavLinks).map(link => {
      const href = link.getAttribute('href');
      if (!href) return null;
      const targetId = href.startsWith('#') ? href.substring(1) : null;
      return targetId;
    }).filter(Boolean);

    if (sectionIds.length > 0) {
      const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

      const updateActive = () => {
        let activeIndex = 0;
        const scrollY = window.scrollY + 160;

        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i] && sections[i].offsetTop <= scrollY) {
            activeIndex = i;
            break;
          }
        }

        subnavLinks.forEach((link, idx) => {
          if (idx === activeIndex) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      };

      window.addEventListener('scroll', updateActive, { passive: true });
      updateActive();
    }
  }

});
