const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ── Auth token injection ───────────────────────────────────────────────────
// ClerkBridge calls setAuthTokenGetter(getToken) and setCurrentUserId(id)
// once on mount so every request automatically includes the auth headers.
let _getToken = null;
let _userId   = null;
export const setAuthTokenGetter = (fn) => { _getToken = fn; };
export const setCurrentUserId   = (id) => { _userId   = id; };

async function getAuthHeader() {
  const headers = {};
  if (_userId) headers["x-user-id"] = _userId;   // dev-bypass fallback
  if (!_getToken) return headers;
  try {
    const token = await _getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch { /* ignore */ }
  return headers;
}

// ── Core request helper ────────────────────────────────────────────────────
const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
};

async function makeRequest(endpoint, options = {}) {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...authHeader, ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const data = await parseJson(response);
    const message = (data && data.message) || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const json = await parseJson(response);
  return json && json.data !== undefined ? json.data : json;
}

// ── Public home-page endpoints ────────────────────────────────────────────
export const getProjects  = ()      => makeRequest("/projects");
export const getStats     = ()      => makeRequest("/stats");
export const getStories   = ()      => makeRequest("/stories");
export const getPartners  = ()      => makeRequest("/partners");
export const getServices  = ()      => makeRequest("/services");
export const subscribeEmail = (email) =>
  makeRequest("/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// ── Help requests ─────────────────────────────────────────────────────────
export const submitHelpRequest = async (formData) => {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${BASE_URL}/help-requests`, {
    method: "POST",
    body: formData,
    headers: authHeader,          // no Content-Type — browser sets multipart boundary
  });
  const json = await parseJson(response);
  if (!response.ok) throw new Error((json && json.message) || `HTTP ${response.status}`);
  return json && json.data !== undefined ? json.data : json;
};

export const getHelpRequests         = ()             => makeRequest("/help-requests");
export const updateHelpRequestStatus = (id, status)  => makeRequest(`/help-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const deleteHelpRequest       = (id)           => makeRequest(`/help-requests/${id}`, { method: "DELETE" });

// ── Admin ─────────────────────────────────────────────────────────────────
export const getAdminStats = () => makeRequest("/admin/stats");

// ── Donations ─────────────────────────────────────────────────────────────
export const getDonations = () => makeRequest("/donations");

export const createDirectDonation = (payload) =>
  makeRequest("/donations", { method: "POST", body: JSON.stringify(payload) });

export const getDonationStats   = ()  => makeRequest("/donations/stats");
export const getRecentDonations = (limit = 10) =>
  makeRequest(`/donations/recent?limit=${limit}`);

// ── Users admin ───────────────────────────────────────────────────────────
export const getUsers              = ()              => makeRequest("/user");
export const adminUpdateUserRole   = (id, role)      => makeRequest(`/user/${id}/role`,   { method: "PUT", body: JSON.stringify({ role }) });
export const adminUpdateUserStatus = (id, status)    => makeRequest(`/user/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });

// ── Notifications ─────────────────────────────────────────────────────────
export const getNotifications         = ()   => makeRequest("/notifications");
export const markNotificationRead     = (id) => makeRequest(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = ()   => makeRequest("/notifications/read-all",   { method: "PATCH" });
export const deleteNotification       = (id) => makeRequest(`/notifications/${id}`,       { method: "DELETE" });

// ── User profile ──────────────────────────────────────────────────────────
export const getUserProfile    = ()       => makeRequest("/user/profile");
export const updateUserProfile = (data)   => makeRequest("/user/profile", { method: "PUT", body: JSON.stringify(data) });
export const getUserActivity   = ()       => makeRequest("/user/activity");

// ── Team (Mohamed) ────────────────────────────────────────────────────────
export const getTeam           = ()            => makeRequest("/team");
export const getTeamMember     = (id)          => makeRequest(`/team/${id}`);
export const createTeamMember  = (payload)     => makeRequest("/team",       { method: "POST",   body: JSON.stringify(payload) });
export const updateTeamMember  = (id, payload) => makeRequest(`/team/${id}`, { method: "PUT",    body: JSON.stringify(payload) });
export const deleteTeamMember  = (id)          => makeRequest(`/team/${id}`, { method: "DELETE" });

// ── Projects (Mohamed) ────────────────────────────────────────────────────
export const getProjectStats   = ()            => makeRequest("/projects/stats");
export const getProjectById    = (id)          => makeRequest(`/projects/${id}`);
export const createProject     = (payload)     => makeRequest("/projects",       { method: "POST",   body: JSON.stringify(payload) });
export const updateProject     = (id, payload) => makeRequest(`/projects/${id}`, { method: "PUT",    body: JSON.stringify(payload) });
export const deleteProject     = (id)          => makeRequest(`/projects/${id}`, { method: "DELETE" });
