// class places with marker :
// methods:
//  show all, clear all, this.foreach((obj)=>{add listener...})

// Clear marker
// marker: {marker, infoCard, marker}[]
import {
  createCurrentLocationPin,
  createTruckPin,
  createSightingPin,
} from "./createPinStyles";
import { getSighting } from "@/app/database-actions";
import { Location } from "../global-component-types";
export const createMarkerOnMap = (
  location: google.maps.LatLng,
  createPin: Function,
  title: string = "place",
  infoCardContent: string,
  map: google.maps.Map
) => {
  const pin = createPin(google);
  const marker: google.maps.marker.AdvancedMarkerElement =
    new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: location,
      title: title,
      content: pin.element,
    });
  const infoCard = new window.google.maps.InfoWindow({
    content: infoCardContent,
    maxWidth: 200,
    position: location,
  });
  const clickListener = marker.addListener("click", () => {
    infoCard.open({ map: map, anchor: marker });
    // clickEvent();
  });
  return { marker, infoCard, clickListener };
};

export const clear = (markers: any[]) => {
  markers.forEach((obj: any) => {
    if (obj.marker && obj.infoCard && obj.clickListener) {
      google.maps.event.removeListener(obj.clickListener);
      obj.infoCard.close();
      obj.marker.setMap(null);
    }
  });
};

export const getLocation = (setLocation: Function) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }
};
export const createInfoCard = (title: string, body: string) =>
  // TODO: a link, route to google map in new page to navigate to place
  `<div class="map_infocard_content">
    <div class="map_infocard_title">${title}</div>
       <Link href="/truck-profile/${1}"></Link>
    <div class="map_infocard_body">${body}</div>
  </div>`;

export const createInfoCardLink = (truckId: number) =>
  // TODO: a link, route to google map in new page to navigate to place
  ` <div>
         <a href="/truck-profile/${truckId}" >GO TRUCK</a>
      </div>`;

export const searchFoodTruck = async (
  google: any,
  map: google.maps.Map,
  setPlaces: Function,
  location: Location
) => {
  const { Place } = (await google.maps.importLibrary(
    "places"
  )) as google.maps.PlacesLibrary;

  const request = {
    textQuery: "Food Truck",
    fields: ["displayName", "location", "businessStatus"],
    locationBias: location,
    includedType: "restaurant",
  };
  //@ts-ignore
  const { places } = await Place.searchByText(request);
  if (places.length) {
    if (map && places) {
      const placeMarkers = places.map((place) => {
        const obj = createMarkerOnMap(
          place.location as google.maps.LatLng,
          createTruckPin,
          place.displayName as string,
          `<div>${place.displayName}</div>`,
          map
        );
        return obj;
      });
      setPlaces(placeMarkers);
    } else {
      console.error("No results");
    }
  }
};
export const fetchSighting = async (
  location: Location,
  map: google.maps.Map,
  setSighting: Function
) => {
  //
  if (!location && !map) {
    return;
  }
  const sightings = (await getSighting(location as Location)) as any[];
  if (sightings.length > 0) {
    // store sightings
    const sightingMarkers = sightings.map((sighting: any) => {
      const location: google.maps.LatLng = new google.maps.LatLng(
        sighting.lat,
        sighting.lng
      );
      const marker = createMarkerOnMap(
        location,
        createSightingPin,
        sighting.id.toString() as string,
        createInfoCardLink(sighting.food_truck_id),
        map as google.maps.Map
      );
      return marker;
    });
    setSighting(sightingMarkers);
  }
};
