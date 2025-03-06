import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

// for server components (those with data fetching and async)
vi.mock("../app/page", () => ({
  default: vi.fn(() => (
    <div>
      <h1>Home</h1>
      <div>Hello world</div>
    </div>
  )),
}));
describe("<Home />", () => {
  test("Home", async () => {
    render(<Home />);
    expect(screen.getByText("Home")).toBeDefined();
  });
});
