import React, { createContext, useContext, useMemo, useState } from "react";

const TOKEN_KEY = "fruitshop_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const value = useMemo(() => {
    const isAuthed = Boolean(token);

    return {
      token,
      isAuthed,
      login: (newToken) => {
        setToken(newToken);
        localStorage.setItem(TOKEN_KEY, newToken);
      },
      logout: () => {
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
      }
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

