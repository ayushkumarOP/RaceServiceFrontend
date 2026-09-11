export type AuthSession = {
  user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
  accessToken: string;
  refreshToken: string;
};

type DummyJsonLoginResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  message?: string;
};

const SESSION_KEY = "f1-hub.auth-session";
const AUTH_ENDPOINT = "https://dummyjson.com/auth/login";

export async function signIn(username: string, password: string): Promise<AuthSession> {
  const response = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  const payload = (await response.json()) as DummyJsonLoginResponse;

  if (!response.ok) {
    throw new Error(payload.message || "Unable to sign in with those credentials.");
  }

  return {
    user: {
      id: payload.id,
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      avatarUrl: payload.image,
    },
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };
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
