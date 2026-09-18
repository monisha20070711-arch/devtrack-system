/**
 * DevTrack - Auth & Session Manager
 */

const Auth = {
  currentUser: null,

  init() {
    this.checkSession();
    this.setupEventListeners();
  },

  checkSession() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const userStr = localStorage.getItem(CONFIG.USER_KEY);

    if (token && userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.renderUserProfile();
        this.showAppView();
      } catch (e) {
        this.logout();
      }
    } else {
      this.showAuthView();
    }
  },

  renderUserProfile() {
    if (!this.currentUser) return;

    const nameEl = document.getElementById('sidebarUserName');
    const roleEl = document.getElementById('sidebarUserRole');
    const avatarEl = document.getElementById('sidebarUserAvatar');

    if (nameEl) nameEl.textContent = this.currentUser.name;
    if (roleEl) roleEl.textContent = this.currentUser.role || 'Developer';
    if (avatarEl) {
      avatarEl.src = this.currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}&background=6366f1&color=fff`;
    }
  },

  showAuthView() {
    document.getElementById('appView').style.display = 'none';
    document.getElementById('authView').style.display = 'flex';
  },

  showAppView() {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'flex';
  },

  async handleLogin(email, password) {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem(CONFIG.TOKEN_KEY, res.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(res.user));
        this.currentUser = res.user;

        Toast.success(`Welcome back, ${res.user.name}!`);
        this.renderUserProfile();
        this.showAppView();
        
        // Refresh dashboard & issues view
        Dashboard.loadStats();
        Issues.loadIssues();
      }
    } catch (err) {
      // Error handled by API wrapper toast
    }
  },

  async handleRegister(name, email, password, role) {
    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      if (res.success) {
        localStorage.setItem(CONFIG.TOKEN_KEY, res.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(res.user));
        this.currentUser = res.user;

        Toast.success('Account created successfully!');
        this.renderUserProfile();
        this.showAppView();

        Dashboard.loadStats();
        Issues.loadIssues();
      }
    } catch (err) {
      // Error handled by API wrapper
    }
  },

  logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    this.currentUser = null;
    Toast.success('Logged out successfully.');
    this.showAuthView();
  },

  setupEventListeners() {
    // Auth Tab Switcher (Login vs Register)
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginTabBtn && registerTabBtn) {
      loginTabBtn.onclick = () => {
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
      };

      registerTabBtn.onclick = () => {
        registerTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
      };
    }

    // Login Form Submit
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        this.handleLogin(email, password);
      };
    }

    // Register Form Submit
    if (registerForm) {
      registerForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        this.handleRegister(name, email, password, role);
      };
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = () => this.logout();
    }
  }
};
