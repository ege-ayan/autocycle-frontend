import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MaterialForm } from "@/components/material-form";
import { readFlow } from "@/lib/flow";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function renderForm(needPlastic = false) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MaterialForm needPlastic={needPlastic} />
    </QueryClientProvider>,
  );
}

function fillRequired() {
  fireEvent.change(screen.getByRole("textbox", { name: "Your company name" }), {
    target: { value: "BMW" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: /material type/i }), {
    target: { value: "PET" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /factory located/i }), {
    target: { value: "Berlin" },
  });
}

describe("MaterialForm", () => {
  afterEach(() => {
    push.mockReset();
    sessionStorage.clear();
    readFlow();
    vi.unstubAllGlobals();
  });

  it("shows the validation message for a blank company", () => {
    renderForm();
    fireEvent.change(
      screen.getByRole("textbox", { name: /factory located/i }),
      { target: { value: "Berlin" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Your company name" }),
      {
        target: { value: "   " },
      },
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Continue" }).closest("form")!,
    );

    expect(screen.getByText("Company name is required.")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("stores the match and opens brand results when no partner is named", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          brand: "BMW",
          plasticType: "PET",
          location: "Berlin",
          needPlastic: true,
          partners: [{ brandName: "Adidas" }],
        }),
      }),
    );
    renderForm(true);
    fillRequired();

    fireEvent.submit(
      screen.getByRole("button", { name: "Continue" }).closest("form")!,
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/brand-match"));
    expect(readFlow()?.needPlastic).toBe(true);
    expect(readFlow()?.collaboration?.partners[0]?.brandName).toBe("Adidas");
  });

  it("opens the product page when a partner is named", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          cached: false,
          sourceBrand: "BMW",
          targetBrand: "Adidas",
          plasticType: "PET",
          location: "Berlin",
          products: [{ name: "Eco Shoe" }],
        }),
      }),
    );
    renderForm();
    fillRequired();
    fireEvent.change(
      screen.getByRole("textbox", { name: /intend to collaborate/i }),
      { target: { value: "Adidas" } },
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Continue" }).closest("form")!,
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/products"));
    expect(readFlow()?.products?.products[0]?.name).toBe("Eco Shoe");
  });

  it("shows the API error and stays on the form", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({
          message: "The model did not return a product concept.",
        }),
      }),
    );
    renderForm();
    fillRequired();

    fireEvent.submit(
      screen.getByRole("button", { name: "Continue" }).closest("form")!,
    );

    expect(
      await screen.findByText("The model did not return a product concept."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
