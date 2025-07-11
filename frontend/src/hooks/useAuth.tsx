import React, { createContext, useContext, useState } from "react";

/* ------------------------------------------------------------------ */
/*                       Contexto & proveedor                         */
/* ------------------------------------------------------------------ */
type AuthContextT = {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextT | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const login = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/*                           Hooks util                               */
/* ------------------------------------------------------------------ */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};

/** Lee el token directo de localStorage (válido fuera de React). */
export const getTokenLS = () => localStorage.getItem("token");
