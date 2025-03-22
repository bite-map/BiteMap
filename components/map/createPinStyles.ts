// This file defines all Pin styles
//pin maker takes google:any
// NEXT TODO: wrap those pin makers into a class, which has a constructor takes google

// ----- Pin for user selected location -----
export function createSelectedLocationPin(google: any) {
  const selectedLocationPin = new google.maps.marker.PinElement({
    scale: 1,
    background: "#82e0aa",
    glyphColor: "#f9ebea",
  });
  return selectedLocationPin;
}
// ----- Pin for user current location -----

// ----- Pin for trucks -----
export function createTruckPin(google: any) {
  const truckPin = new google.maps.marker.PinElement({
    scale: 1,

    background: "#82e0aa",

    borderColor: "#196f3d",
    glyphColor: "#196f3d",
  });
  return truckPin;
}
// ----- Pin for trucks -----

// ----- Pin for sightings -----
const activityLevel = {
  l0: "#fef9e7",
  l1: "#fcf3cf",
  l2: "#f9e79f",
  l3: "#f7dc6f",
  l4: "#f4d03f",
  l5: "#f1c40f",
};
// TODO: change sighting by frequency, calculate a relative number by ranking in whole table(which sighitng is the most popular one), and send that rate within route to frontend
// temperary default activity level as 3
export function createSightingPin(google: any, activity: number = 3) {
  const sightingPin = new google.maps.marker.PinElement({
    scale: 1.2,
    background: activityLevel[
      `l${activity}` as keyof typeof activityLevel
    ] as string,
    borderColor: "#ca6f1e",
    glyphColor: "#ca6f1e",
  });
  return sightingPin;
}
// ----- Pin for sightings -----
