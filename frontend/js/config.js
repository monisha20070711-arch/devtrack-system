/**
 * DevTrack - Frontend Configuration Constants
 */

const CONFIG = {
  // Base API URL (Relative when served from express or absolute localhost)
  API_BASE_URL: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? `${window.location.origin}/api`
    : '/api',
  
  // Storage Keys
  TOKEN_KEY: 'devtrack_token',
  USER_KEY: 'devtrack_user',
  THEME_KEY: 'devtrack_theme',

  // Status & Priority Mappings
  STATUS_CLASSES: {
    'Open': 'badge-status-open',
    'In Progress': 'badge-status-progress',
    'Resolved': 'badge-status-resolved'
  },

  PRIORITY_CLASSES: {
    'High': 'badge-priority-high',
    'Medium': 'badge-priority-medium',
    'Low': 'badge-priority-low'
  }
};
