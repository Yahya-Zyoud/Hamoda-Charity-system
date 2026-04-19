const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
    }
    throw new Error(message);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}


export const getProjects = () => apiFetch("/projects");

export const getStats = () => apiFetch("/stats");

export const getStories = () => apiFetch("/stories");

export const getPartners = () => apiFetch("/partners");


/**
 * POST /api/subscribe — subscribes an email to the newsletter.
 * @param {string} email
 * @returns {{ success: boolean, message: string }}
 */
export const subscribeEmail = (email) =>
  apiFetch("/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const getServices = () => apiFetch("/services");
