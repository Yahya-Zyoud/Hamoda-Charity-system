const url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function makeRequest(endpoint, options = {}) {
  const response = await fetch(`${url}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      msg = body.message || msg;
    } catch (parseError) {
      console.debug("[api] Failed to parse error response:", parseError);
    }
    throw new Error(msg);
  }

  const json = await response.json();
  return json.data !== undefined ? json.data : json;
}

export const getProjects = () => makeRequest("/projects");

export const getStats = () => makeRequest("/stats");

export const getStories = () => makeRequest("/stories");

export const getPartners = () => makeRequest("/partners");

export const subscribeEmail = (email) =>
  makeRequest("/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const getServices = () => makeRequest("/services");
