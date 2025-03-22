// import { describe, expect, test, vi } from "vitest";
// import { render, screen } from "@testing-library/react";
// import Home from "../app/page";

// // for server components (those with data fetching and async)
// vi.mock("../app/page", () => ({
//   default: vi.fn(() => (
//     <div>
//       <h1>Home</h1>
//       <div>Hello world</div>
//     </div>
//   )),
// }));
// describe("<Home />", () => {
//   test("Home", async () => {
//     render(<Home />);
//     expect(screen.getByText("Home")).toBeDefined();
//   });
// });

import { describe, it, expect } from "vitest";

// FAKE SIGHTING DATA
const fakeSightings = [
  {food_truck_id: "truck123", location: "Tokyo", created_at: "2025-03-10T10:00:00Z"}, // monday
  {food_truck_id: "truck123", location: "Tokyo", created_at: "2025-03-03T10:00:00Z"}, // monday
  {food_truck_id: "truck123", location: "Tokyo", created_at: "2025-02-24T10:00:00Z"}, // monday
  {food_truck_id: "truck123", location: "Tokyo", created_at: "2025-02-02T10:00:00Z"}, // sunday
  {food_truck_id: "truck123", location: "Osaka", created_at: "2025-03-03T10:00:00Z"}, // monday but different location
  {food_truck_id: "truck456", location: "Tokyo", created_at: "2025-03-09T10:00:00Z"}, // sunday
  {food_truck_id: "truck123", location: "Tokyo", created_at: "2025-03-17T10:00:00Z"}, // monday
]

// CHANCE CALCULATION FUNCTION
const calculateChance = (truckId: string, sightings: typeof fakeSightings, location: string): number => {
  const filteredSightings = sightings.filter((s) => s.food_truck_id === truckId && s.location === location);

  const mondaySightings = filteredSightings.filter((s) => {
    const date = new Date(s.created_at);
    return date.getDay() ===  1; // Monday
  })

  const percentage = mondaySightings.length / filteredSightings.length;

  return Math.min(percentage, 0.9)
}


// TESTS

describe("calculateChance function", () => {
  it("should return 90%(0.9) if 90% of sightings happened on a Monday", () => {
    const result = calculateChance("truck123", fakeSightings, "Tokyo");
    expect(result).toBe(0.8)
  })
})

it("should return 0%(0.0) if 00% of sightings happened on a Monday", () => {
  const result = calculateChance("truck456", fakeSightings, "Tokyo");
  expect(result).toBe(0.0)
})

it("should return 20%(0.2) if 0% of sightings happened on a Monday", () => {
  const result = calculateChance("truck123", fakeSightings, "Tokyo");
  expect(result).toBe(0.2)
})

it("should return a max of 90% even if all sightings are on Monday", () => {
  const allMondaySightings = [
    { food_truck_id: "truck999", location: "Kyoto", created_at: "2025-03-10T10:00:00Z" },
    { food_truck_id: "truck999", location: "Kyoto", created_at: "2025-03-03T10:00:00Z" },
  ];
  
  const result = calculateChance("truck999", allMondaySightings, "Kyoto");
  expect(result).toBe(0.9);
});