import {
  createSelectedLocationPin,
  createTruckPin,
  createSightingPin,
} from "./createPinStyles";
import {
  getSightingsByLastActive,
  getSightingBySightingId,
} from "@/app/database-actions";
import { Location } from "../global-component-types";
import { PostgrestError } from "@supabase/supabase-js";
import { error } from "console";
// for google static truck:
export const createMarkerOnMap = (
  location: google.maps.LatLng,
  createPin: Function,
  title: string = "place",
  map: google.maps.Map,
  clickEvent: Function | null = null
  // setSelectedPlace
) => {
  const pin = createPin(google);
  const marker: google.maps.marker.AdvancedMarkerElement =
    new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: location,
      title: title,
      content: pin.element,
    });

  const clickListener = marker.addListener("click", () => {
    //
    if (clickEvent) {
      clickEvent();
    }
  });
  return { marker, infoCard: null, clickListener };
};

export const clear = (
  markers: {
    clickListener: null | any;
    infoCard: null | any;
    marker: google.maps.marker.AdvancedMarkerElement;
  }[]
) => {
  markers.forEach(
    (obj: {
      clickListener: null | any;
      infoCard: null | any;
      marker: google.maps.marker.AdvancedMarkerElement;
    }) => {
      if (obj) {
        google.maps.event.removeListener(obj.clickListener);
        if (obj.infoCard) {
          obj.infoCard.close();
        }
        if (obj.marker) {
          obj.marker.map = null;
        }
      }
    }
  );
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
  return null;
};

export const searchFoodTruck = async (
  google: any,
  map: google.maps.Map,
  setPlaces: Function,
  location: Location,
  setSelectedStatic: (place: any) => void
) => {
  const { Place } = (await google.maps.importLibrary(
    "places"
  )) as google.maps.PlacesLibrary;
  const center = new google.maps.LatLng(location.lat, location.lng);
  const circle = new google.maps.Circle({ center: center, radius: 5000 });
  const request = {
    textQuery: "Food Truck",
    fields: ["displayName", "location", "businessStatus", "formattedAddress"],
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
          map,
          () => {
            setSelectedStatic(place);
          }
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
  setSightingMarkers: (sightingArray: any[]) => void,
  setSelectedSighting: (sighting: any) => void,
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

        map as google.maps.Map,
        sightingMarkerClickEvent
      );
      return marker;
    });
    setSightingMarkers(sightingMarkers);
  }
};

//
export const displayInitSighting = async (
  initialSightinId: number,
  map: google.maps.Map,
  setSighting: (sightings: any[]) => void,
  setSelectedSighting: (sighting: any) => void,
  setDisplaySightingsMarker: (param: boolean) => void
) => {
  if (initialSightinId) {
    try {
      // fetch that sighting
      const initFetchedSighting = await getSightingBySightingId(
        Number(initialSightinId)
      );
      if (initFetchedSighting instanceof PostgrestError) {
        return;
      }
      await makeSightingMarkerUsingSighting(
        map,
        setSighting,
        setSelectedSighting,
        initFetchedSighting
      );
      setDisplaySightingsMarker(true);
      map?.setCenter(
        new google.maps.LatLng({
          lat: initFetchedSighting[0].lat,
          lng: initFetchedSighting[0].lng,
        })
      );
      setSelectedSighting(initFetchedSighting[0]);
    } catch (error) {
      console.error(error);
    }
  }
};

export const fetchImg = async (google: any, placeId: string) => {};
