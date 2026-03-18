import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

const bootstrapPayload = {
  user: { id: "user-1", email: "cook@example.com" },
  pantry: [],
  commonIngredients: ["Ikan Ujian"],
  foodItems: [
    {
      id: "f-1",
      name: { bm: "Harga API", en: "API Price" },
      category: "protein",
      currentPrice: 4.2,
      previousPrice: 3.8,
      unit: "kg",
      region: "Selangor",
      trend: [3.5, 3.7, 3.8, 4.0, 4.2],
      nationalAvg: 3.9,
    },
  ],
  disruptions: [
    {
      id: "d-1",
      item: { bm: "Bekalan API", en: "API Supply" },
      region: "Selangor",
      severity: "medium",
      description: { bm: "Gangguan ujian", en: "Test disruption" },
      date: "2026-03-18",
    },
  ],
  recipes: [
    {
      id: "r-1",
      name: { bm: "Resipi API", en: "API Recipe" },
      ingredients: ["Ikan Ujian"],
      prepTime: 10,
      estimatedCost: 5.5,
      calories: 220,
      tags: ["halal"],
      steps: { bm: ["Masak"], en: ["Cook"] },
    },
  ],
  communityRecipes: [
    {
      id: "c-1",
      title: { bm: "Komuniti API", en: "API Community" },
      author: "Tester",
      rating: 4.5,
      comments: 12,
    },
  ],
};

function createJsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("App API integration", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the auth page when the API reports no active session", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      if (String(input).includes("/api/auth/session")) {
        return createJsonResponse({ user: null });
      }

      throw new Error(`Unexpected request: ${String(input)}`);
    });

    render(<App />);

    expect(await screen.findByText("Log masuk ke akaun anda")).toBeInTheDocument();
  });

  it("renders dashboard and pantry content from API bootstrap data", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);

      if (url.includes("/api/auth/session")) {
        return createJsonResponse({ user: bootstrapPayload.user });
      }

      if (url.includes("/api/app/bootstrap")) {
        return createJsonResponse(bootstrapPayload);
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    render(<App />);

    expect(await screen.findByText("Harga API")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /pantri/i }));

    expect(await screen.findByRole("button", { name: /ikan ujian/i })).toBeInTheDocument();
  });
});
