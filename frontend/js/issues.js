/**
 * DevTrack - Issues Management Controller
 * Handles Issue Table CRUD, Live Search, Multi-Filtering & Detail Modals.
 */

const Issues = {
  currentIssues: [],
  developers: [],
  editingIssueId: null,

  init() {
    this.setupEventListeners();
    this.loadDevelopers();
    this.loadIssues();
  },

  async loadDevelopers() {
    try {
      const res = await API.get('/users');
      if (res && res.success) {
        this.developers = res.users;
        this.populateDeveloperDropdowns();
      }
    } catch (err) {
      console.error('[Issues] Failed to load developers:', err);
    }
  },

  populateDeveloperDropdowns() {
    const selects = [
      document.getElementById('issueAssigneeSelect'),
      document.getElementById('editIssueAssigneeSelect')
    ];

    selects.forEach(select => {
      if (!select) return;
      const currentValue = select.value;
      select.innerHTML = `<option value="">-- Unassigned --</option>` +
        this.developers.map(dev => `
          <option value="${dev.id}">${dev.name} (${dev.role || 'Developer'})</option>
        `).join('');
      select.value = currentValue;
    });
  },

  async loadIssues() {
    const search = document.getElementById('issueSearchInput')?.value || '';
    const status = document.getElementById('filterStatusSelect')?.value || 'All';
    const priority = document.getElementById('filterPrioritySelect')?.value || 'All';
    const category = document.getElementById('filterCategorySelect')?.value || 'All';
    const sortBy = document.getElementById('sortSelect')?.value || 'newest';

    const queryParams = new URLSearchParams({ search, status, priority, category, sortBy });

    try {
      const res = await API.get(`/issues?${queryParams.toString()}`);
      if (res && res.success) {
        this.currentIssues = res.issues;
        this.renderTable(res.issues);
      }
    } catch (err) {
      console.error('[Issues] Failed to load issues:', err);
    }
  },

  renderTable(issues = []) {
    const tbody = document.getElementById('issuesTableBody');
    const emptyState = document.getElementById('issuesEmptyState');

    if (!tbody) return;

    if (issues.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = issues.map(issue => `
      <tr>
        <td>
          <div class="issue-title-cell">
            <span class="issue-main-title" onclick="Issues.openDetailsModal(${issue.id})">
              #${issue.id} - ${this.escapeHtml(issue.title)}
            </span>
            <span class="issue-sub-desc">${this.escapeHtml(issue.description || 'No description provided.')}</span>
          </div>
        </td>
        <td>
          <span class="badge ${CONFIG.STATUS_CLASSES[issue.status] || ''}">
            ${issue.status}
          </span>
        </td>
        <td>
          <span class="badge ${CONFIG.PRIORITY_CLASSES[issue.priority] || ''}">
            ${issue.priority}
          </span>
        </td>
        <td>
          <span class="badge badge-category">
            ${issue.category}
          </span>
        </td>
        <td>
          <div class="assignee-cell">
            <img class="assignee-avatar" 
                 src="${issue.assignee_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(issue.assignee_name || 'U')}&background=374151&color=fff`}" 
                 alt="${this.escapeHtml(issue.assignee_name || 'Unassigned')}">
            <span>${this.escapeHtml(issue.assignee_name || 'Unassigned')}</span>
          </div>
        </td>
        <td>${this.formatDate(issue.created_at)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" title="View Details" onclick="Issues.openDetailsModal(${issue.id})">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
            <button class="btn-icon" title="Edit Issue" onclick="Issues.openEditModal(${issue.id})">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="btn-icon delete" title="Delete Issue" onclick="Issues.confirmDelete(${issue.id}, '${this.escapeHtml(issue.title)}')">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openCreateModal() {
    this.editingIssueId = null;
    document.getElementById('issueFormModalTitle').textContent = 'Create New Issue';
    document.getElementById('issueForm').reset();
    this.populateDeveloperDropdowns();

    const overlay = document.getElementById('issueFormModalOverlay');
    if (overlay) overlay.classList.add('active');
  },

  openEditModal(id) {
    const issue = this.currentIssues.find(i => i.id === id);
    if (!issue) return;

    this.editingIssueId = id;
    document.getElementById('issueFormModalTitle').textContent = `Edit Issue #${id}`;
    
    document.getElementById('issueTitleInput').value = issue.title;
    document.getElementById('issueDescInput').value = issue.description || '';
    document.getElementById('issueStatusSelect').value = issue.status;
    document.getElementById('issuePrioritySelect').value = issue.priority;
    document.getElementById('issueCategorySelect').value = issue.category;
    
    this.populateDeveloperDropdowns();
    document.getElementById('issueAssigneeSelect').value = issue.assignee_id || '';

    const overlay = document.getElementById('issueFormModalOverlay');
    if (overlay) overlay.classList.add('active');
  },

  async handleFormSubmit() {
    const title = document.getElementById('issueTitleInput').value;
    const description = document.getElementById('issueDescInput').value;
    const status = document.getElementById('issueStatusSelect').value;
    const priority = document.getElementById('issuePrioritySelect').value;
    const category = document.getElementById('issueCategorySelect').value;
    const assignee_id = document.getElementById('issueAssigneeSelect').value || null;

    if (!title || title.trim() === '') {
      Toast.error('Please enter an issue title.');
      return;
    }

    const payload = { title, description, status, priority, category, assignee_id };

    try {
      if (this.editingIssueId) {
        const res = await API.put(`/issues/${this.editingIssueId}`, payload);
        if (res.success) {
          Toast.success('Issue updated successfully!');
          this.closeFormModal();
          this.loadIssues();
          Dashboard.loadStats();
        }
      } else {
        const res = await API.post('/issues', payload);
        if (res.success) {
          Toast.success('Issue created successfully!');
          this.closeFormModal();
          this.loadIssues();
          Dashboard.loadStats();
        }
      }
    } catch (err) {
      // Error handled by API toast
    }
  },

  closeFormModal() {
    const overlay = document.getElementById('issueFormModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  async openDetailsModal(id) {
    try {
      const res = await API.get(`/issues/${id}`);
      if (res && res.success) {
        const issue = res.issue;
        document.getElementById('detailTitle').textContent = `#${issue.id} - ${issue.title}`;
        document.getElementById('detailDesc').textContent = issue.description || 'No detailed description provided.';
        
        document.getElementById('detailStatus').className = `badge ${CONFIG.STATUS_CLASSES[issue.status]}`;
        document.getElementById('detailStatus').textContent = issue.status;

        document.getElementById('detailPriority').className = `badge ${CONFIG.PRIORITY_CLASSES[issue.priority]}`;
        document.getElementById('detailPriority').textContent = issue.priority;

        document.getElementById('detailCategory').textContent = issue.category;
        document.getElementById('detailReporter').textContent = issue.reporter_name || 'System';
        document.getElementById('detailAssignee').textContent = issue.assignee_name || 'Unassigned';
        document.getElementById('detailCreated').textContent = this.formatDate(issue.created_at);

        const overlay = document.getElementById('issueDetailModalOverlay');
        if (overlay) overlay.classList.add('active');
      }
    } catch (err) {
      console.error('[Issues] Detail load error:', err);
    }
  },

  closeDetailsModal() {
    const overlay = document.getElementById('issueDetailModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  confirmDelete(id, title) {
    ConfirmModal.show({
      title: 'Delete Issue',
      message: `Are you sure you want to permanently delete issue #${id} ("${title}")?`,
      confirmText: 'Delete Issue',
      onConfirm: async () => {
        try {
          const res = await API.delete(`/issues/${id}`);
          if (res.success) {
            Toast.success(`Issue #${id} deleted successfully.`);
            this.loadIssues();
            Dashboard.loadStats();
          }
        } catch (err) {
          // Error handled by API wrapper
        }
      }
    });
  },

  setupEventListeners() {
    // Filter controls change listener
    const filterIds = ['filterStatusSelect', 'filterPrioritySelect', 'filterCategorySelect', 'sortSelect'];
    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.onchange = () => this.loadIssues();
    });

    // Live search input with debounce
    const searchInput = document.getElementById('issueSearchInput');
    let debounceTimer;
    if (searchInput) {
      searchInput.oninput = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => this.loadIssues(), 300);
      };
    }

    // Modal submit button
    const form = document.getElementById('issueForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      };
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};
