/**
 * DevTrack - Dashboard Interactive Charts Component
 * Renders Status distribution (Doughnut) & Priority distribution (Bar chart).
 */

const Charts = {
  statusChartInstance: null,
  priorityChartInstance: null,

  /**
   * Render or Update Charts with DB stats payload
   */
  renderCharts(statusDist = [], priorityDist = []) {
    this.renderStatusChart(statusDist);
    this.renderPriorityChart(priorityDist);
  },

  renderStatusChart(dist) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;

    const labels = ['Open', 'In Progress', 'Resolved'];
    const dataMap = { 'Open': 0, 'In Progress': 0, 'Resolved': 0 };
    
    dist.forEach(item => {
      if (dataMap[item.status] !== undefined) {
        dataMap[item.status] = parseInt(item.count, 10);
      }
    });

    const values = labels.map(l => dataMap[l]);
    const colors = ['#ef4444', '#f59e0b', '#10b981'];

    // If Chart.js library is available via CDN
    if (window.Chart) {
      if (this.statusChartInstance) {
        this.statusChartInstance.destroy();
      }

      this.statusChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: document.body.getAttribute('data-theme') === 'light' ? '#374151' : '#9ca3af',
                font: { family: 'Plus Jakarta Sans', weight: '600' }
              }
            }
          }
        }
      });
    } else {
      this.renderSVGFallback(canvas, labels, values, colors);
    }
  },

  renderPriorityChart(dist) {
    const canvas = document.getElementById('priorityChart');
    if (!canvas) return;

    const labels = ['High', 'Medium', 'Low'];
    const dataMap = { 'High': 0, 'Medium': 0, 'Low': 0 };
    
    dist.forEach(item => {
      if (dataMap[item.priority] !== undefined) {
        dataMap[item.priority] = parseInt(item.count, 10);
      }
    });

    const values = labels.map(l => dataMap[l]);
    const colors = ['#ef4444', '#f59e0b', '#3b82f6'];

    if (window.Chart) {
      if (this.priorityChartInstance) {
        this.priorityChartInstance.destroy();
      }

      this.priorityChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Count',
            data: values,
            backgroundColor: colors,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: document.body.getAttribute('data-theme') === 'light' ? '#374151' : '#9ca3af' }
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: document.body.getAttribute('data-theme') === 'light' ? '#374151' : '#9ca3af'
              }
            }
          }
        }
      });
    }
  }
};
