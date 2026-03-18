import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { AppBootstrap } from "@/lib/contracts";
import { bootstrapQueryKey, useBootstrap } from "./useBootstrap";

export function usePantry() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useBootstrap();
  const pantry = data?.pantry ?? [];

  const toggleItem = useCallback(
    async (item: string) => {
      if (!data) {
        return;
      }

      const previous = data;
      const nextPantry = pantry.includes(item)
        ? pantry.filter((entry) => entry !== item)
        : [...pantry, item];

      queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, {
        ...data,
        pantry: nextPantry,
      });

      try {
        const response = pantry.includes(item)
          ? await apiRequest<{ pantry: string[] }>(`/api/pantry/items/${encodeURIComponent(item)}`, {
              method: "DELETE",
            })
          : await apiRequest<{ pantry: string[] }>("/api/pantry/items", {
              method: "POST",
              body: JSON.stringify({ name: item }),
            });

        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, {
          ...previous,
          pantry: response.pantry,
        });
      } catch (error) {
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, previous);
        toast.error(error instanceof Error ? error.message : "Unable to update pantry.");
      }
    },
    [data, pantry, queryClient],
  );

  return { pantry, toggleItem, loading: isLoading };
}
