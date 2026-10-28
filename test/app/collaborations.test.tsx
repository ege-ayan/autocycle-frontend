import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CollaborationsPage from "@/app/collaborations/page";

describe("CollaborationsPage", () => {
  it("offers both material paths", () => {
    render(<CollaborationsPage />);

    expect(
      screen.getByRole("link", { name: /i have material/i }),
    ).toHaveAttribute("href", "/have-material");
    expect(
      screen.getByRole("link", { name: /i need material/i }),
    ).toHaveAttribute("href", "/need-material");
  });
});
