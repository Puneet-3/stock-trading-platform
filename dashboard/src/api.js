export const siteUrl = import.meta.env.VITE_SITE_URL ?? "http://localhost:3000";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";

export async function request(path, { body, key, signal } = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers:
      body === undefined
        ? {}
        : {
            "Content-Type": "application/json",
            ...(key ? { "Idempotency-Key": key } : {}),
          },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: signal || AbortSignal.timeout(15000),
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok)
    throw Object.assign(new Error(data.message || "Request failed."), {
      status: response.status,
    });
  return data;
}

export const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
export const dateTime = (date) =>
  new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
