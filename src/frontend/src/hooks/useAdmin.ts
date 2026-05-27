import { useCallback, useEffect, useState } from "react";

const ADMIN_KEY = "pl_admin_session";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(ADMIN_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: StorageEvent) => {
      if (e.key === ADMIN_KEY) {
        setIsAdmin(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === "Mmandk280315$") {
      sessionStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
