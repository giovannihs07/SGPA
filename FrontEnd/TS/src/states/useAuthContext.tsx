import { deleteCookie, hasCookie, setCookie } from "cookies-next";
import { createContext, useContext, useState, ReactNode } from "react";
import { AuthContextType, User } from "@src/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

const authSessionKey = "_ATTEX_MUI_AUTH_";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  const saveSession = (user: User) => {
    setCookie(authSessionKey, JSON.stringify(user));
    setUser(user);
  };

  const removeSession = () => {
    deleteCookie(authSessionKey);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: hasCookie(authSessionKey),
        saveSession,
        removeSession,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
