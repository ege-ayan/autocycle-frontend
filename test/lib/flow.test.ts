import { beforeEach, describe, expect, it } from "vitest";

import { readFlow, saveFlow, updateFlow } from "@/lib/flow";

const request = {
  brand: "BMW",
  plasticType: "PET",
  location: "Berlin",
  needPlastic: false,
};

describe("flow storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    readFlow();
  });

  it("round-trips a collaboration", () => {
    saveFlow({
      ...request,
      collaboration: {
        ...request,
        partners: [],
      },
    });

    expect(readFlow()?.collaboration?.brand).toBe("BMW");
  });

  it("merges a later product result", () => {
    saveFlow(request);

    const next = updateFlow({
      products: {
        cached: false,
        sourceBrand: "BMW",
        targetBrand: "Adidas",
        plasticType: "PET",
        location: "Berlin",
        products: [],
      },
    });

    expect(next.brand).toBe("BMW");
    expect(readFlow()?.products?.targetBrand).toBe("Adidas");
  });

  it("drops a corrupt payload", () => {
    sessionStorage.setItem("autocycle.flow", "{");

    expect(readFlow()).toBeNull();
  });
});
