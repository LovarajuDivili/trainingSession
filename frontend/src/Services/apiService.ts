type ApiRequestOptions<T = unknown> = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  payload?: T;
};

const token = localStorage.getItem("token");
const url = "http://localhost:5000";

export async function apiRequest<TResponse = any, TPayload = any>({
  endpoint,
  method,
  payload,
}: ApiRequestOptions<TPayload>): Promise<TResponse> {
  console.log(endpoint, "endpoint");

  const res = await fetch(`${url}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  console.log(res, "response");

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
