import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function usePantry() {
  const { user } = useAuth();
  const [pantry, setPantryState] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pantry from DB
  useEffect(() => {
    if (!user) {
      setPantryState([]);
      setLoading(false);
      return;
    }

    const fetchPantry = async () => {
      const { data, error } = await supabase
        .from("pantry_items")
        .select("name")
        .order("added_at", { ascending: true });

      if (!error && data) {
        setPantryState(data.map((d) => d.name));
      }
      setLoading(false);
    };

    fetchPantry();
  }, [user]);

  const toggleItem = useCallback(
    async (item: string) => {
      if (!user) return;

      if (pantry.includes(item)) {
        // Remove
        setPantryState((prev) => prev.filter((i) => i !== item));
        await supabase
          .from("pantry_items")
          .delete()
          .eq("user_id", user.id)
          .eq("name", item);
      } else {
        // Add
        setPantryState((prev) => [...prev, item]);
        await supabase
          .from("pantry_items")
          .insert({ user_id: user.id, name: item });
      }
    },
    [user, pantry]
  );

  return { pantry, toggleItem, loading };
}
