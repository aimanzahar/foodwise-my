import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { AppUser } from "@/lib/contracts";
import { bootstrapQueryKey } from "./useBootstrap";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    apiRequest<{ user: AppUser | null }>("/api/auth/session")
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setUser(response.user);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setUser(null);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const response = await apiRequest<{ user: AppUser }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        setUser(response.user);
        queryClient.removeQueries({ queryKey: bootstrapQueryKey });
      },
      signUp: async (email, password) => {
        const response = await apiRequest<{ user: AppUser }>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        setUser(response.user);
        queryClient.removeQueries({ queryKey: bootstrapQueryKey });
      },
      signOut: async () => {
        await apiRequest<void>("/api/auth/logout", {
          method: "POST",
        });
        setUser(null);
        queryClient.removeQueries({ queryKey: bootstrapQueryKey });
      },
    }),
    [loading, queryClient, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
