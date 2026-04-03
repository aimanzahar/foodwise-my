import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import type { AppBootstrap, PantryItem } from "@/lib/contracts";
import { bootstrapQueryKey, useBootstrap } from "./useBootstrap";

export function usePantry() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useBootstrap();
  const pantry: PantryItem[] = data?.pantry ?? [];

  const addItem = useCallback(
    async (item: PantryItem) => {
      if (!data) return;

      const previous = data;
      const existing = pantry.find((p) => p.name === item.name);
      const nextPantry = existing
        ? pantry.map((p) => p.name === item.name ? { ...p, quantity: p.quantity + item.quantity } : p)
        : [...pantry, item];

      queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, { ...data, pantry: nextPantry });

      try {
        const response = await apiRequest<{ pantry: PantryItem[] }>("/api/pantry/items", {
          method: "POST",
          body: JSON.stringify(item),
        });
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, { ...previous, pantry: response.pantry });
      } catch (error) {
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, previous);
        toast.error(error instanceof Error ? error.message : "Unable to update pantry.");
      }
    },
    [data, pantry, queryClient],
  );

  const removeItem = useCallback(
    async (name: string) => {
      if (!data) return;

      const previous = data;
      const nextPantry = pantry.filter((p) => p.name !== name);

      queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, { ...data, pantry: nextPantry });

      try {
        const response = await apiRequest<{ pantry: PantryItem[] }>(
          `/api/pantry/items/${encodeURIComponent(name)}`,
          { method: "DELETE" },
        );
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, { ...previous, pantry: response.pantry });
      } catch (error) {
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, previous);
        toast.error(error instanceof Error ? error.message : "Unable to update pantry.");
      }
    },
    [data, pantry, queryClient],
  );

  const updateItem = useCallback(
    async (name: string, updates: { quantity?: number; unit?: string }) => {
      if (!data) return;

      const previous = data;
      const nextPantry = pantry.map((p) =>
        p.name === name ? { ...p, ...updates } : p,
      );

      queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, { ...data, pantry: nextPantry });

      try {
        const response = await apiRequest<{ pantry: PantryItem[] }>(
          `/api/pantry/items/${encodeURIComponent(name)}`,
          { method: "PATCH", body: JSON.stringify(updates) },
        );
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, { ...previous, pantry: response.pantry });
      } catch (error) {
        queryClient.setQueryData<AppBootstrap>(bootstrapQueryKey, previous);
        toast.error(error instanceof Error ? error.message : "Unable to update pantry.");
      }
    },
    [data, pantry, queryClient],
  );

  return { pantry, addItem, removeItem, updateItem, loading: isLoading };
}
