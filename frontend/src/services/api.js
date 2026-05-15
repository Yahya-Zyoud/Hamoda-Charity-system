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
