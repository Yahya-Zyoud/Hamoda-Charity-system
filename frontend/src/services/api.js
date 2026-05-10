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

const getAuthToken = () => {
  try {
    return localStorage.getItem("charity_token") || null;
  } catch {
    return null;
  }
};

async function makeRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
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

// ── Auth endpoints ─────────────────────────────────────────────────
export const registerUser = (payload) =>
  makeRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const loginUser = (payload) =>
  makeRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) });
export const logoutUser = () =>
  makeRequest("/auth/logout", { method: "POST" });

// ── Public data endpoints ──────────────────────────────────────────
export const getProjects  = ()      => makeRequest("/projects");
export const getStats     = ()      => makeRequest("/stats");
export const getStories   = ()      => makeRequest("/stories");
export const getPartners  = ()      => makeRequest("/partners");
export const getServices  = ()      => makeRequest("/services");
export const subscribeEmail = (email) =>
  makeRequest("/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// ── Help Request endpoints ─────────────────────────────────────────
export const submitHelpRequest = (payload) =>
  makeRequest("/help-requests", { method: "POST", body: JSON.stringify(payload) });
export const getHelpRequests = () => makeRequest("/help-requests");
export const updateHelpRequest = (id, payload) =>
  makeRequest(`/help-requests/${id}`, { method: "PUT", body: JSON.stringify(payload) });

// ── Donation endpoints ─────────────────────────────────────────────
export const submitDonation = (payload) =>
  makeRequest("/donations", { method: "POST", body: JSON.stringify(payload) });
export const getDonations = () => makeRequest("/donations");

// ── Team/Project endpoints (Mohamed's MongoDB-based) ───────────────
export const getTeam           = ()            => makeRequest("/team");
export const getTeamMember     = (id)          => makeRequest(`/team/${id}`);
export const createTeamMember  = (payload)     => makeRequest("/team",       { method: "POST",   body: JSON.stringify(payload) });
export const updateTeamMember  = (id, payload) => makeRequest(`/team/${id}`, { method: "PUT",    body: JSON.stringify(payload) });
export const deleteTeamMember  = (id)          => makeRequest(`/team/${id}`, { method: "DELETE" });

export const getProjectStats   = ()            => makeRequest("/projects/stats");
export const getProjectById    = (id)          => makeRequest(`/projects/${id}`);
export const createProject     = (payload)     => makeRequest("/projects",       { method: "POST",   body: JSON.stringify(payload) });
export const updateProject     = (id, payload) => makeRequest(`/projects/${id}`, { method: "PUT",    body: JSON.stringify(payload) });
export const deleteProject     = (id)          => makeRequest(`/projects/${id}`, { method: "DELETE" });
