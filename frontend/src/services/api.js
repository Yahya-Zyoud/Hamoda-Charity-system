const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async (url, options = {}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await parseJson(response);

  if (!response.ok) {
    const message = data?.message || response.statusText || "حدث خطأ أثناء الاتصال بالخادم";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
};

export const getTeam = () => request("/api/team");
export const getTeamMember = (id) => request(`/api/team/${id}`);
export const createTeamMember = (payload) => request("/api/team", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const updateTeamMember = (id, payload) => request(`/api/team/${id}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
export const deleteTeamMember = (id) => request(`/api/team/${id}`, {
  method: "DELETE",
});

export const getProjects = (query = "") => request(`/api/projects${query}`);
export const getProjectStats = () => request("/api/projects/stats");
export const getProjectById = (id) => request(`/api/projects/${id}`);
export const createProject = (payload) => request("/api/projects", {
  method: "POST",
  body: JSON.stringify(payload),
});
export const updateProject = (id, payload) => request(`/api/projects/${id}`, {
  method: "PUT",
  body: JSON.stringify(payload),
});
export const deleteProject = (id) => request(`/api/projects/${id}`, {
  method: "DELETE",
});
