import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { fetchCurrentUser, login as loginApi, logout as logoutApi, register as registerApi } from "../services/authService.js";
import { tokenStorage } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginApi(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    const newUser = await registerApi(payload);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
