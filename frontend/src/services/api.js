const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

async function makeRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
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

// ── Yahya's JSON-file-based endpoints ─────────────────────────────
export const getProjects  = ()      => makeRequest("/projects");
export const getStats     = ()      => makeRequest("/stats");
export const getStories   = ()      => makeRequest("/stories");
export const getPartners  = ()      => makeRequest("/partners");
export const getServices  = ()      => makeRequest("/services");
export const subscribeEmail = (email) =>
  makeRequest("/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// ── Ahmad's endpoints ─────────────────────────────────────────────
export const submitHelpRequest = async (formData, clerkId = "") => {
  const headers = {};
  if (clerkId) headers["x-user-id"] = clerkId;
  const response = await fetch(`${BASE_URL}/help-requests`, { method: "POST", body: formData, headers });
  const json = await parseJson(response);
  if (!response.ok) throw new Error((json && json.message) || `HTTP ${response.status}`);
  return json && json.data !== undefined ? json.data : json;
};
export const getHelpRequests         = ()             => makeRequest("/help-requests");
export const updateHelpRequestStatus = (id, status)  => makeRequest(`/help-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
export const deleteHelpRequest       = (id)           => makeRequest(`/help-requests/${id}`, { method: "DELETE" });

// ── Admin ──────────────────────────────────────────────────────────
export const getAdminStats = () => makeRequest("/admin/stats");

// ── Donations ─────────────────────────────────────────────────────
export const getDonations = () => makeRequest("/donations");

export const createCheckoutSession = (payload, clerkId = "") =>
  makeRequest("/donations/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clerkId ? { "x-user-id": clerkId } : {}),
    },
    body: JSON.stringify(payload),
  });

export const verifyDonation = (sessionId) =>
  makeRequest(`/donations/verify?session_id=${encodeURIComponent(sessionId)}`);

// ── Users admin ───────────────────────────────────────────────────
export const getUsers            = ()              => makeRequest("/user");
export const adminUpdateUserRole  = (id, role)    => makeRequest(`/user/${id}/role`,   { method: "PUT", body: JSON.stringify({ role }) });
export const adminUpdateUserStatus = (id, status) => makeRequest(`/user/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });

// ── Notifications ─────────────────────────────────────────────────
export const getNotifications        = ()   => makeRequest("/notifications");
export const markNotificationRead    = (id) => makeRequest(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = ()  => makeRequest("/notifications/read-all",   { method: "PATCH" });
export const deleteNotification      = (id) => makeRequest(`/notifications/${id}`,       { method: "DELETE" });

// ── User profile ──────────────────────────────────────────────────
const userHeaders = (clerkId) => ({ "Content-Type": "application/json", "x-user-id": clerkId });

export const getUserProfile   = (clerkId)         => makeRequest("/user/profile", { headers: userHeaders(clerkId) });
export const updateUserProfile = (clerkId, data)  => makeRequest("/user/profile", { method: "PUT", headers: userHeaders(clerkId), body: JSON.stringify(data) });
export const getUserActivity  = (clerkId)         => makeRequest("/user/activity", { headers: userHeaders(clerkId) });

// ── Mohamed's MongoDB-based endpoints ─────────────────────────────
export const getTeam           = ()           => makeRequest("/team");
export const getTeamMember     = (id)         => makeRequest(`/team/${id}`);
export const createTeamMember  = (payload)    => makeRequest("/team",    { method: "POST",   body: JSON.stringify(payload) });
export const updateTeamMember  = (id, payload)=> makeRequest(`/team/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteTeamMember  = (id)         => makeRequest(`/team/${id}`, { method: "DELETE" });

export const getProjectStats   = ()           => makeRequest("/projects/stats");
export const getProjectById    = (id)         => makeRequest(`/projects/${id}`);
export const createProject     = (payload)    => makeRequest("/projects",    { method: "POST",   body: JSON.stringify(payload) });
export const updateProject     = (id, payload)=> makeRequest(`/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteProject     = (id)         => makeRequest(`/projects/${id}`, { method: "DELETE" });
