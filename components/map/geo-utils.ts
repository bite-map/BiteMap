import {
  createCurrentLocationPin,
  createTruckPin,
  createSightingPin,
} from "./createPinStyles";
import { getSightingsByLastActive } from "@/app/database-actions";
import { Location } from "../global-component-types";

export const createMarkerOnMap = (
  location: google.maps.LatLng,
  createPin: Function,
  title: string = "place",
  infoCardContent: string | null = null,
  map: google.maps.Map,
  clickEvent: Function | null = null
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
    if (infoCardContent) {
      infoCard.open({ map: map, anchor: marker });
    }
    if (clickEvent) {
      clickEvent();
    }
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

export const getLocation = (
  setLocation: Function,
  setLocationDenied: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationDenied(false);
      },
      (error) => {
        setLocationDenied(true);
        throw error;
      }
    );
  }
};

// very similar to getLocation but will update when the users position changes
export const trackLocation = (
  setLocation: Function,
  setLocationDenied: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (navigator.geolocation) {
    return navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationDenied(false);
      },
      (error) => {
        setLocationDenied(true);
        throw error;
      },
      { enableHighAccuracy: true }
    );
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
  const center = new google.maps.LatLng(location.lat, location.lng);
  const circle = new google.maps.Circle({ center: center, radius: 5000 });
  const request = {
    textQuery: "Food Truck",
    fields: ["displayName", "location", "businessStatus"],
    locationBias: circle,
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
  setSightingMarkers: Function,
  setSelectedSighting: Function
) => {
  //
  if (!location && !map) {
    return;
  }
  const sightings = (await getSightingsByLastActive()) as any[];
  console.log(sightings, "sssss");
  if (sightings.length > 0) {
    // store sightings
    const sightingMarkers = sightings.map((sighting: any) => {
      const location: google.maps.LatLng = new google.maps.LatLng(
        sighting.lat,
        sighting.lng
      );
      const sightingMarkerClickEvent = () => {
        setSelectedSighting(sighting);
      };
      const marker = createMarkerOnMap(
        location,
        createSightingPin,
        sighting.id.toString() as string,
        null,
        map as google.maps.Map,
        sightingMarkerClickEvent
      );
      return marker;
    });
    setSightingMarkers(sightingMarkers);
  }
};

export const makeSightingMarkerUsingSighting = async (
  map: google.maps.Map,
  setSightingMarkers: Function,
  setSelectedSighting: Function,
  sightings: any[]
) => {
  if (sightings.length > 0) {
    // store sightings
    const sightingMarkers = sightings.map((sighting: any) => {
      const location: google.maps.LatLng = new google.maps.LatLng(
        sighting.lat,
        sighting.lng
      );
      const sightingMarkerClickEvent = () => {
        setSelectedSighting(sighting);
      };
      const marker = createMarkerOnMap(
        location,
        createSightingPin,
        sighting.id.toString() as string,
        null,
        map as google.maps.Map,
        sightingMarkerClickEvent
      );
      return marker;
    });
    setSightingMarkers(sightingMarkers);
  }
};
