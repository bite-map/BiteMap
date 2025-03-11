// This file defines all Pin styles
//pin maker takes google:any
// NEXT TODO: wrap those pin makers into a class, which has a constructor takes google
export class PinMaker {
  constructor(googleObj: any) {
    const google = googleObj;
    const activityLevel = {
      l0: "#eafaf1",
      l1: "#d5f5e3",
      l2: "#abebc6",
      l3: "#82e0aa",
      l4: "#58d68d",
      l5: "#2ecc71",
    };
  }
  createCurrentLocationPin() {}
  createTruckPin() {}
  createSightingPin() {}
}

// ----- Pin for user current location -----
export function createCurrentLocationPin(google: any) {
  const currentLocationPin = new google.maps.marker.PinElement({
    scale: 1.5,
    background: "#cd6155",
    borderColor: "#cd6155",
    glyphColor: "#f9ebea",
  });
  return currentLocationPin;
}
// ----- Pin for user current location -----

// ----- Pin for trucks -----
export function createTruckPin(google: any) {
  const truckPin = new google.maps.marker.PinElement({
    scale: 1.3,
    background: "#f8c471",
    borderColor: "#af601a",
    glyphColor: "#af601a",
  });
  return truckPin;
}
// ----- Pin for trucks -----

// ----- Pin for sightings -----
const activityLevel = {
  l0: "#eafaf1",
  l1: "#d5f5e3",
  l2: "#abebc6",
  l3: "#82e0aa",
  l4: "#58d68d",
  l5: "#2ecc71",
};
// TODO: change sighting by frequency, calculate a relative number by ranking in whole table(which sighitng is the most popular one), and send that rate within route to frontend
// temperary default activity level as 3
export function createSightingPin(google: any, activity: number = 3) {
  const sightingPin = new google.maps.marker.PinElement({
    scale: 1,
    background: activityLevel[
      `l${activity}` as keyof typeof activityLevel
    ] as string,
    borderColor: "#196f3d",
    glyphColor: "#196f3d",
  });
  return sightingPin;
}
// ----- Pin for sightings -----
