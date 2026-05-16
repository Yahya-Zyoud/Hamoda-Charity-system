const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ── Auth token injection ───────────────────────────────────────────────────
// ClerkBridge calls setAuthTokenGetter(getToken) and setCurrentUserId(id)
// via useLayoutEffect on mount, so the getters are populated before any
// child component fires a data-fetch useEffect.
// Keeping them as module-level variables (not React state) means every
// makeRequest call reads the latest token without re-subscribing to context.
let _getToken = null;
let _userId   = null;
export const setAuthTokenGetter = (fn) => { _getToken = fn; };
export const setCurrentUserId   = (id) => { _userId   = id; };

/**
 * Builds the auth headers for every outgoing request.
 * x-user-id is the dev-bypass header the backend accepts when
 * CLERK_SECRET_KEY is not set. In production only the JWT matters.
 */
async function getAuthHeader() {
  const headers = {};
  if (_userId) headers["x-user-id"] = _userId;
  if (!_getToken) return headers;
  try {
    const token = await _getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch { /* Clerk token fetch failed — request proceeds unauthenticated */ }
  return headers;
}

// ── Core request helper ────────────────────────────────────────────────────

/**
 * Reads the response body as text first so an empty 204 body doesn't crash
 * JSON.parse, then falls back to returning the raw text on parse failure
 * (useful for plain-text error messages from upstream middleware).
 */
const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
};

/**
 * Central fetch wrapper used by every API call in this file.
 *
 * Automatically:
 *  - Attaches Clerk JWT (or dev x-user-id header)
 *  - Throws a typed Error with error.status for non-2xx responses
 *  - Unwraps the backend's { success, data } envelope so callers
 *    receive the payload directly instead of the wrapper object
 */
async function makeRequest(endpoint, options = {}) {
  const authHeader = await getAuthHeader();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...authHeader, ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const data    = await parseJson(response);
    const message = (data && data.message) || `HTTP ${response.status}`;
    const error   = new Error(message);
    error.status  = response.status;
    throw error;
  }

  const json = await parseJson(response);
  // Backend always wraps responses as { success, data, message }.
  // Return data directly; fall back to the full body for non-standard responses.
  return json && json.data !== undefined ? json.data : json;
}

// ── Public home-page endpoints ────────────────────────────────────────────
export const getProjects    = ()      => makeRequest("/projects");
export const getStats       = ()      => makeRequest("/stats");
export const getStories     = ()      => makeRequest("/stories");
export const getPartners    = ()      => makeRequest("/partners");
export const getServices    = ()      => makeRequest("/services");
export const subscribeEmail = (email) =>
  makeRequest("/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// ── Help requests ─────────────────────────────────────────────────────────

/**
 * Sends a multipart/form-data POST — must NOT use makeRequest because
 * setting Content-Type manually would overwrite the browser-generated
 * boundary that multer needs to parse the file upload correctly.
 */
export const submitHelpRequest = async (formData) => {
  const authHeader = await getAuthHeader();
  const response   = await fetch(`${BASE_URL}/help-requests`, {
    method: "POST",
    body:   formData,
    headers: authHeader,
  });
  const json = await parseJson(response);
  if (!response.ok) throw new Error((json && json.message) || `HTTP ${response.status}`);
  return json && json.data !== undefined ? json.data : json;
};

export const getHelpRequests         = ()            => makeRequest("/help-requests");
export const updateHelpRequestStatus = (id, status) => makeRequest(`/help-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const deleteHelpRequest       = (id)          => makeRequest(`/help-requests/${id}`, { method: "DELETE" });

// ── Admin ─────────────────────────────────────────────────────────────────
export const getAdminStats = () => makeRequest("/admin/stats");

// ── Donations ─────────────────────────────────────────────────────────────
export const getDonations          = ()             => makeRequest("/donations");
export const createDirectDonation  = (payload)      => makeRequest("/donations", { method: "POST", body: JSON.stringify(payload) });
export const getDonationStats      = ()             => makeRequest("/donations/stats");
export const getRecentDonations    = (limit = 10)   => makeRequest(`/donations/recent?limit=${limit}`);

// ── Users admin ───────────────────────────────────────────────────────────
export const getUsers              = ()           => makeRequest("/user");
export const adminUpdateUserRole   = (id, role)   => makeRequest(`/user/${id}/role`,   { method: "PUT", body: JSON.stringify({ role }) });
export const adminUpdateUserStatus = (id, status) => makeRequest(`/user/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });

// ── Notifications ─────────────────────────────────────────────────────────
export const getNotifications         = ()   => makeRequest("/notifications");
export const markNotificationRead     = (id) => makeRequest(`/notifications/${id}/read`,  { method: "PATCH" });
export const markAllNotificationsRead = ()   => makeRequest("/notifications/read-all",    { method: "PATCH" });
export const deleteNotification       = (id) => makeRequest(`/notifications/${id}`,        { method: "DELETE" });

// ── User profile ──────────────────────────────────────────────────────────
export const getUserProfile    = ()     => makeRequest("/user/profile");
export const updateUserProfile = (data) => makeRequest("/user/profile", { method: "PUT", body: JSON.stringify(data) });
export const getUserActivity   = ()     => makeRequest("/user/activity");

// ── Team (Mohamed) ────────────────────────────────────────────────────────
export const getTeam          = ()             => makeRequest("/team");
export const getTeamMember    = (id)           => makeRequest(`/team/${id}`);
export const createTeamMember = (payload)      => makeRequest("/team",        { method: "POST",   body: JSON.stringify(payload) });
export const updateTeamMember = (id, payload)  => makeRequest(`/team/${id}`,  { method: "PUT",    body: JSON.stringify(payload) });
export const deleteTeamMember = (id)           => makeRequest(`/team/${id}`,  { method: "DELETE" });

// ── Projects (Mohamed) ────────────────────────────────────────────────────
export const getProjectStats = ()             => makeRequest("/projects/stats");
export const getProjectById  = (id)           => makeRequest(`/projects/${id}`);
export const createProject   = (payload)      => makeRequest("/projects",        { method: "POST",   body: JSON.stringify(payload) });
export const updateProject   = (id, payload)  => makeRequest(`/projects/${id}`,  { method: "PUT",    body: JSON.stringify(payload) });
export const deleteProject   = (id)           => makeRequest(`/projects/${id}`,  { method: "DELETE" });
