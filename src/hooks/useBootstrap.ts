import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { AppBootstrap } from "@/lib/contracts";
import { useAuth } from "./useAuth";

export const bootstrapQueryKey = ["bootstrap"] as const;

export function useBootstrap() {
  const { user } = useAuth();

  return useQuery({
    queryKey: bootstrapQueryKey,
    queryFn: () => apiRequest<AppBootstrap>("/api/app/bootstrap"),
    enabled: Boolean(user),
  });
}
