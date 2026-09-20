export type AuthSession = {
  user: { id: number; name: string; email: string; avatarUrl: string };
  accessToken: string;
  refreshToken: string;
};

type UserServiceAuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: { id?: number | string; username?: string; name?: string; email?: string; avatarUrl?: string };
  message?: string;
  error?: { message?: string };
  errors?: Record<string, string[] | string>;
  title?: string;
};

const SESSION_KEY = "f1-hub.auth-session";
const DEFAULT_USER_API_URL = "https://userservice-942724250878.asia-south1.run.app";
const USER_API_URL = (import.meta.env.VITE_USER_API_URL || DEFAULT_USER_API_URL).replace(/\/$/, "");

function responseMessage(payload: UserServiceAuthResponse, fallback: string) {
  if (payload.message) return payload.message;
  if (payload.error?.message) return payload.error.message;
  if (payload.title) return payload.title;
  const firstError = payload.errors && Object.values(payload.errors).flat().find(Boolean);
  return firstError || fallback;
}

async function readResponse(response: Response): Promise<UserServiceAuthResponse> {
  if (!(response.headers.get("content-type") || "").includes("application/json")) return {};
  return (await response.json().catch(() => ({}))) as UserServiceAuthResponse;
}

function sessionFromResponse(payload: UserServiceAuthResponse, emailOrUsername: string): AuthSession {
  const user = payload.user;
  const email = user?.email || (emailOrUsername.includes("@") ? emailOrUsername : "");
  const name = user?.name || user?.username || (email ? email.split("@")[0] : emailOrUsername);
  return {
    user: { id: typeof user?.id === "number" ? user.id : Number(user?.id) || 0, name, email, avatarUrl: user?.avatarUrl || "" },
    accessToken: payload.accessToken || payload.token || "",
    refreshToken: payload.refreshToken || "",
  };
}

export async function signIn(emailOrUsername: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${USER_API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername, password }),
  });
  const payload = await readResponse(response);
  if (!response.ok) throw new Error(responseMessage(payload, "Unable to sign in with those credentials."));
  return sessionFromResponse(payload, emailOrUsername);
}

export async function register(email: string, username: string, password: string, confirmPassword: string): Promise<void> {
  const response = await fetch(`${USER_API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password, confirmPassword }),
  });
  const payload = await readResponse(response);
  if (!response.ok) throw new Error(responseMessage(payload, "Unable to create your account. Please try again."));
}

export function getStoredSession(): AuthSession | null {
  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    return rawSession ? (JSON.parse(rawSession) as AuthSession) : null;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
