/**
 * DevTrack - Main Application Orchestrator & View Router
 */

const App = {
  currentView: 'dashboard',

  init() {
    this.initTheme();
    Auth.init();
    this.setupNavigation();
    
    // Load data if authenticated
    if (Auth.currentUser) {
      Dashboard.loadStats();
      Issues.init();
    }
  },

  initTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    this.updateThemeToggleIcon(savedTheme);

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.onclick = () => {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem(CONFIG.THEME_KEY, next);
        this.updateThemeToggleIcon(next);
        
        // Refresh charts with new theme colors
        Dashboard.loadStats();
      };
    }
  },

  updateThemeToggleIcon(theme) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    if (theme === 'dark') {
      themeBtn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
    } else {
      themeBtn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    }
  },

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        const targetView = item.getAttribute('data-view');
        if (targetView) {
          this.switchView(targetView);
        }
      };
    });

    // Mobile Sidebar Drawer Toggle
    const menuToggle = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebarDrawer');
    if (menuToggle && sidebar) {
      menuToggle.onclick = () => {
        sidebar.classList.toggle('active');
      };
    }
  },

  switchView(viewName) {
    this.currentView = viewName;

    // Update Nav Active State
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Page Header Title
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) {
      titleEl.textContent = viewName === 'dashboard' ? 'Overview Dashboard' : 'Issue Tracker Roster';
    }

    // Toggle Panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`${viewName}ViewPanel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Load panel data
    if (viewName === 'dashboard') {
      Dashboard.loadStats();
    } else if (viewName === 'issues') {
      Issues.loadIssues();
    }

    // Close mobile drawer if active
    const sidebar = document.getElementById('sidebarDrawer');
    if (sidebar) sidebar.classList.remove('active');
  }
};

// Bootstrap App when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
