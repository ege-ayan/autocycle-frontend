import { describe, expect, it, vi } from "vitest";

import {
  ApiError,
  createCollaboration,
  createProducts,
  errorMessage,
} from "@/lib/api/client";
import { materialRequestSchema } from "@/lib/api/types";

const request = {
  brand: "BMW",
  plasticType: "PET",
  location: "Berlin",
  needPlastic: false,
};

describe("materialRequestSchema", () => {
  it("requires a company and a location", () => {
    const result = materialRequestSchema.safeParse({
      ...request,
      brand: "  ",
      location: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("errorMessage", () => {
  it("prefers the API message", () => {
    expect(
      errorMessage({ message: "Request validation failed" }, "fallback"),
    ).toBe("Request validation failed");
  });

  it("uses the first field error when the message is empty", () => {
    expect(
      errorMessage(
        { message: "", fieldErrors: { sourceBrand: "must not be blank" } },
        "fallback",
      ),
    ).toBe("must not be blank");
  });

  it("returns the fallback for a missing body", () => {
    expect(errorMessage(null, "fallback")).toBe("fallback");
  });
});

describe("createCollaboration", () => {
  it("posts camelCase fields and parses partners", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        brand: "BMW",
        plasticType: "PET",
        location: "Berlin",
        needPlastic: false,
        partners: [{ brandName: "Adidas", confidenceScore: 90 }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createCollaboration(request);

    expect(fetchMock).toHaveBeenCalledWith(
      "/backend/api/collaborations",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          brand: "BMW",
          plasticType: "PET",
          location: "Berlin",
          needPlastic: false,
        }),
      }),
    );
    expect(result.partners[0]?.brandName).toBe("Adidas");
    expect(result.partners[0]?.brandPlacement).toEqual([]);
  });

  it("raises the API error message", async () => {
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

    await expect(createCollaboration(request)).rejects.toBeInstanceOf(ApiError);
    await expect(createCollaboration(request)).rejects.toThrow(
      "The model did not return a product concept.",
    );
  });
});

describe("createProducts", () => {
  it("posts the source and target brands", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        cached: false,
        sourceBrand: "BMW",
        targetBrand: "Adidas",
        plasticType: "PET",
        location: "Berlin",
        products: [{ name: "Eco Shoe" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await createProducts({ ...request, targetBrand: "Adidas" });

    expect(fetchMock).toHaveBeenCalledWith(
      "/backend/api/products",
      expect.objectContaining({
        body: JSON.stringify({
          sourceBrand: "BMW",
          plasticType: "PET",
          location: "Berlin",
          targetBrand: "Adidas",
        }),
      }),
    );
    expect(result.products[0]?.name).toBe("Eco Shoe");
    expect(result.products[0]?.pitch).toBe("");
  });
});
