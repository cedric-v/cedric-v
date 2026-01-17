/**
 * Header Navigation Script
 * Handles mobile menu interactions and header scrolling effects
 */

class HeaderNavigation {
  constructor() {
    this.header = document.getElementById('main-header');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenu = document.querySelector('[data-menu-mobile]');
    this.mobileDropdowns = document.querySelectorAll('[data-mobile-dropdown]');
    this.lastScrollY = window.scrollY;
    this.ticking = false;

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupMobileDropdowns();
    this.setupScrollEffects();
  }

  setupMobileMenu() {
    if (!this.mobileMenuToggle || !this.mobileMenu) return;

    this.mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && !this.mobileMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const isExpanded = this.mobileMenu.classList.contains('expanded');
    if (isExpanded) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenu.classList.add('expanded');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
  }

  closeMobileMenu() {
    this.mobileMenu.classList.remove('expanded');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    // Close all dropdowns when closing main menu
    this.closeAllMobileDropdowns();
  }

  setupMobileDropdowns() {
    this.mobileDropdowns.forEach(button => {
      button.addEventListener('click', () => {
        const dropdownId = button.getAttribute('data-mobile-dropdown');
        this.toggleMobileDropdown(dropdownId, button);
      });
    });
  }

  toggleMobileDropdown(dropdownId, button) {
    const content = document.querySelector(`[data-dropdown-content="${dropdownId}"]`);
    if (!content) return;

    const isExpanded = content.classList.contains('expanded');

    // Close all other dropdowns first
    this.closeAllMobileDropdowns();

    if (!isExpanded) {
      content.classList.add('expanded');
      button.setAttribute('data-expanded', 'true');
    } else {
      content.classList.remove('expanded');
      button.setAttribute('data-expanded', 'false');
    }
  }

  closeAllMobileDropdowns() {
    // Close all dropdown contents
    document.querySelectorAll('.mobile-dropdown-content').forEach(content => {
      content.classList.remove('expanded');
    });

    // Reset all dropdown buttons
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(button => {
      button.setAttribute('data-expanded', 'false');
    });
  }

  setupScrollEffects() {
    if (!this.header) return;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > 50;

      if (isScrolled) {
        this.header.classList.add('header-scrolled');
      } else {
        this.header.classList.remove('header-scrolled');
      }

      this.lastScrollY = scrollY;
      this.ticking = false;
    };

    const onScroll = () => {
      if (!this.ticking) {
        window.requestAnimationFrame(updateHeader);
        this.ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateHeader);

    // Initialize
    updateHeader();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HeaderNavigation();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeaderNavigation;
}