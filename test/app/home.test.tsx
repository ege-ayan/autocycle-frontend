import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("starts the collaboration flow", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/collaborations",
    );
  });
});
