export const dashboardUrl =
  import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3001";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";

export async function authenticate(path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to sign in.");
  localStorage.removeItem("token");
  window.location.assign(dashboardUrl);
}
