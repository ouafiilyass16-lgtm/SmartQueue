import { createContext, useState } from "react";
import { login as loginService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

 const login = async (credentials) => {
  const data = await loginService(credentials);



  // Le reste de ton code...
    if (!data?.token) {
      throw new Error("Le serveur n'a pas renvoyé de token JWT.");
    }

    localStorage.setItem("token", data.token);

    const userData = {
      email: data.email ?? credentials.email,
      role: String(data.role ?? "").toUpperCase(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: Boolean(user && localStorage.getItem("token")),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
