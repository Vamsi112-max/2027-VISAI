import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('visai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (session expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('visai_token');
      localStorage.removeItem('visai_user');
      window.dispatchEvent(new CustomEvent('visai:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Teams
export const teamsAPI = {
  create: (data) => api.post('/teams', data),
  myTeam: () => api.get('/teams/my'),
  saveLeader: (teamId, data) => api.put(`/teams/${teamId}/leader`, data),
  saveMembers: (teamId, members) => api.put(`/teams/${teamId}/members`, { members }),
  saveCollege: (teamId, data) => api.put(`/teams/${teamId}/college`, data),
  list: (params) => api.get('/teams', { params }),
  get: (id) => api.get(`/teams/${id}`),
  stats: () => api.get('/teams/stats/overview'),
  lock: (teamId, is_locked) => api.put(`/teams/${teamId}/lock`, { is_locked }),
  lockAll: (is_locked) => api.put('/teams/admin/lock-all', { is_locked }),
};

// Payments
export const paymentsAPI = {
  createOrder: () => api.post('/payments/create-order'),
  verify: (data) => api.post('/payments/verify', data),
  payOnline: (data) => api.post('/payments/pay-online', data),
  myPayment: () => api.get('/payments/my'),
  list: (params) => api.get('/payments', { params }),
  approveInvoice: (id) => api.post(`/payments/approve-invoice/${id}`),
  getInvoice: (teamId) => api.get(`/payments/invoice/${teamId}`),
};

// Problem Statements
export const problemsAPI = {
  list: (params) => api.get('/problem-statements', { params }),
  get: (id) => api.get(`/problem-statements/${id}`),
  select: (id) => api.post(`/problem-statements/${id}/select`),
  // Admin
  create: (data) => api.post('/problem-statements', data),
  update: (id, data) => api.put(`/problem-statements/${id}`, data),
  delete: (id, force) => api.delete(`/problem-statements/${id}${force ? '?force=archive' : ''}`),
  adminList: () => api.get('/problem-statements/admin/all'),
};

// Submissions
export const submissionsAPI = {
  submit: (formData) => api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  mySubmissions: () => api.get('/submissions/my'),
  list: (params) => api.get('/submissions', { params }),
  get: (id) => api.get(`/submissions/${id}`),
};

// Jury
export const juryAPI = {
  list: () => api.get('/jury'),
  create: (data) => api.post('/jury', data),
  assign: (data) => api.post('/jury/assign', data),
  bulkAssign: (data) => api.post('/jury/assign/bulk', data),
  removeAssignment: (id) => api.delete(`/jury/assign/${id}`),
  myAssignments: () => api.get('/jury/my-assignments'),
  assignments: () => api.get('/jury/my-assignments'),
  flagConflict: (assignmentId, reason) => api.post(`/jury/conflict/${assignmentId}`, { reason }),
  getEvaluation: (id) => api.get(`/jury/evaluation/${id}`),
  submitEvaluation: (id, data) => api.post(`/jury/evaluation/${id}`, data),
  dashboard: () => api.get('/jury/assignments/dashboard'),
};

// Results
export const resultsAPI = {
  list: (params) => api.get('/results', { params }),
  myResults: () => api.get('/results/my'),
  adminList: (params) => api.get('/results/admin', { params }),
  finalize: (data) => api.post('/results/finalize', data),
  publish: (roundId) => api.post('/results/publish', { round_id: roundId }),
  unpublish: (roundId) => api.post('/results/unpublish', { round_id: roundId }),
};

// Admin
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  updateTeamStatus: (id, status) => api.put(`/admin/teams/${id}/status`, { status }),
  updateTeamPayment: (id, payment_status) => api.put(`/admin/teams/${id}/payment`, { payment_status }),
  auditLogs: (params) => api.get('/admin/audit-logs', { params }),
  eventSettings: () => api.get('/admin/event-settings'),
  updateSetting: (key, value) => api.put(`/admin/event-settings/${key}`, { value }),
  rounds: () => api.get('/admin/rounds'),
  createRound: (data) => api.post('/admin/rounds', data),
  updateRound: (id, data) => api.put(`/admin/rounds/${id}`, data),
  criteria: (roundId) => api.get('/admin/evaluation-criteria', { params: { round_id: roundId } }),
  exportTeams: () => api.get('/admin/export/teams', { responseType: 'blob' }),
  dbStatus: () => api.get('/admin/db/status'),
  syncBackup: () => api.post('/admin/db/sync-backup'),
  testTiDb: (data) => api.post('/admin/db/test-tidb', data),
  sendEmail: (data) => api.post('/admin/send-email', data),
  emailLogs: (params) => api.get('/admin/email-logs', { params }),
  emailRecipientsPreview: (params) => api.get('/admin/email-recipients-preview', { params }),
};

// Checkin
export const checkinAPI = {
  search: (q) => api.get('/results/checkin/search', { params: { q } }),
  checkin: (teamId, notes) => api.post('/results/checkin', { team_id: teamId, notes }),
};
