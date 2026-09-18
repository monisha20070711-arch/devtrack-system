/**
 * DevTrack - Dashboard Logic & Metrics Manager
 */

const Dashboard = {
  async loadStats() {
    try {
      const res = await API.get('/dashboard/stats');
      if (res && res.success) {
        const { summary, statusDistribution, priorityDistribution, recentIssues } = res.data;

        // Update Stat Cards
        this.updateStatCard('statTotalIssues', summary.total);
        this.updateStatCard('statOpenIssues', summary.open);
        this.updateStatCard('statProgressIssues', summary.inProgress);
        this.updateStatCard('statResolvedIssues', summary.resolved);
        this.updateStatCard('statHighPriority', summary.highPriority);

        // Update Visual Charts
        Charts.renderCharts(statusDistribution, priorityDistribution);

        // Update Recent Activity List
        this.renderRecentIssues(recentIssues);
      }
    } catch (err) {
      console.error('[Dashboard Error]', err);
    }
  },

  updateStatCard(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = value !== undefined ? value : 0;
    }
  },

  renderRecentIssues(issues = []) {
    const container = document.getElementById('recentIssuesList');
    if (!container) return;

    if (issues.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-title">No Recent Activity</div>
          <div class="empty-desc">Create your first issue to track activity here.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = issues.map(issue => `
      <div style="padding: 0.85rem 1rem; border-bottom: var(--glass-border); display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 700; font-size: 0.9rem; cursor: pointer;" onclick="Issues.openDetailsModal(${issue.id})">
            ${this.escapeHtml(issue.title)}
          </div>
          <div style="font-size: 0.775rem; color: var(--text-muted);">
            Category: ${issue.category} • Assigned to ${this.escapeHtml(issue.assignee_name || 'Unassigned')}
          </div>
        </div>
        <div>
          <span class="badge ${CONFIG.STATUS_CLASSES[issue.status] || ''}">${issue.status}</span>
        </div>
      </div>
    `).join('');
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};
