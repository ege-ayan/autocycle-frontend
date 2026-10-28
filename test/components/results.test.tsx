import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BrandMatches } from "@/components/brand-matches";
import { ProductResult } from "@/components/product-result";
import { readFlow, saveFlow } from "@/lib/flow";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const partner = {
  brandName: "Adidas",
  brandPlacement: ["Sportswear"],
  sustainabilityPlacement: "Recycled PET",
  productAssumptions: ["Sneakers"],
  collaborationSummary: "A shared product line.",
  estimatedImpact: "12 tonnes",
  confidenceScore: 86,
  combinedReach: "40M",
  companyDomain: "adidas.com",
};

function renderMatches() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <BrandMatches />
    </QueryClientProvider>,
  );
}

describe("brand and product results", () => {
  afterEach(() => {
    push.mockReset();
    sessionStorage.clear();
    readFlow();
    vi.unstubAllGlobals();
  });

  it("asks for the form when no match is stored", () => {
    renderMatches();

    expect(
      screen.getByText("Complete the form before choosing a brand."),
    ).toBeInTheDocument();
  });

  it("requests a product for the selected brand", async () => {
    saveFlow({
      brand: "BMW",
      plasticType: "PET",
      location: "Berlin",
      needPlastic: false,
      collaboration: {
        brand: "BMW",
        plasticType: "PET",
        location: "Berlin",
        needPlastic: false,
        partners: [partner],
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          cached: true,
          sourceBrand: "BMW",
          targetBrand: "Adidas",
          plasticType: "PET",
          location: "Berlin",
          products: [
            { name: "Ultraboost ECO", description: "A recycled upper." },
          ],
        }),
      }),
    );
    renderMatches();

    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/products"));
    expect(readFlow()?.partner?.brandName).toBe("Adidas");
    expect(readFlow()?.products?.cached).toBe(true);
  });

  it("keeps the brand list when product generation fails", async () => {
    saveFlow({
      brand: "BMW",
      plasticType: "PET",
      location: "Berlin",
      needPlastic: false,
      collaboration: {
        brand: "BMW",
        plasticType: "PET",
        location: "Berlin",
        needPlastic: false,
        partners: [partner],
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ message: "Product generation failed." }),
      }),
    );
    renderMatches();

    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    expect(
      await screen.findByText("Product generation failed."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("asks for a collaboration when no product is stored", () => {
    render(<ProductResult />);

    expect(
      screen.getByText("No product yet. Choose a collaboration first."),
    ).toBeInTheDocument();
  });

  it("renders the concept, pitch headings, and the change link", () => {
    saveFlow({
      brand: "BMW",
      plasticType: "PET",
      location: "Berlin",
      needPlastic: true,
      partner,
      products: {
        cached: false,
        sourceBrand: "BMW",
        targetBrand: "Adidas",
        plasticType: "PET",
        location: "Berlin",
        products: [
          {
            name: "Ultraboost ECO",
            type: "Footwear",
            description: "A recycled upper.",
            pitch: "Intro line\n## Concept\n**Bold** claim",
          },
        ],
      },
    });

    render(<ProductResult />);

    expect(
      screen.getByRole("heading", { name: "BMWxAdidas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ultraboost ECO" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Concept" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bold claim")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The product concept is ready. An image was not returned.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("86%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Change" })).toHaveAttribute(
      "href",
      "/need-material",
    );

    fireEvent.click(screen.getByRole("button", { name: "Show more" }));
    expect(
      screen.getByRole("button", { name: "Show less" }),
    ).toBeInTheDocument();
  });
});
