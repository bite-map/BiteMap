"use client";

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

export default function Map() {
  // references
  const mapRef = useRef<HTMLDivElement>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  // state varaibles
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const [places, setPlaces] = useState<google.maps.places.Place[]>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["core", "maps", "places", "marker"],
    version: "weekly",
  });

  // gets current location from device
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  // loads nearby places
  async function nearbySearch() {
    //@ts-ignore
    const { Place } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;

    const request = {
      textQuery: "Curry",
      fields: ["displayName", "location", "businessStatus"],
      locationBias: location,
      includedType: "restaurant",
    };
    //@ts-ignore
    const { places } = await Place.searchByText(request);
    if (places.length) {
      setPlaces(places);
      console.log(places);
    } else {
      console.error("No results");
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (isLoaded && location) {
      const mapOptions = {
        center: location,
        zoom: 17,
        mapId: "3f60e97302b8c3",
      };

      // setup the map
      const gMap = new google.maps.Map(
        mapRef.current as HTMLDivElement,
        mapOptions
      );

      // options for autocomplete
      const options = {
        // add bounds here for Tokyo <------ TODO
        componentRestrictions: { country: "jp" },
        strictBounds: false,
        fields: ["address_components", "geometry"],
        types: ["address"],
      };

      // setup autocomplete
      const gAutoComplete = new google.maps.places.Autocomplete(
        placeAutoCompleteRef.current as HTMLInputElement,
        options
      );

      setMap(gMap);
      setAutoComplete(gAutoComplete);

      // uncomment if needed
      //nearbySearch();
    }
  }, [isLoaded, location]);

  return (
    <>
      {isLoaded && location ? (
        <>
          <div
            id="map"
            ref={mapRef}
            className="w-full h-[500px] relative overflow-hidden"
          ></div>
          <input
            className="mt-3 bg-slate-300"
            type="text"
            ref={placeAutoCompleteRef}
          />
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </>
  );
}
