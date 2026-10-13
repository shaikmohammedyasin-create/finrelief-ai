import api, { tokenStorage } from "./api.js";

export async function register({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  tokenStorage.setTokens(data.tokens.access_token, data.tokens.refresh_token);
  return data.user;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  tokenStorage.setTokens(data.tokens.access_token, data.tokens.refresh_token);
  return data.user;
}

export async function logout() {
  const refreshToken = tokenStorage.getRefreshToken();
  try {
    if (refreshToken) {
      await api.post("/auth/logout", { refresh_token: refreshToken });
    }
  } finally {
    tokenStorage.clear();
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/profile", payload);
  return data;
}
