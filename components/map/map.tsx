"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const [places, setPlaces] = useState<google.maps.places.Place[]>();
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

  // load nearby places
  async function nearbySearch() {
    //@ts-ignore
    const { Place } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    // Search parameters
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
    } else {
      console.error("No results");
    }
  }

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    // load map
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");
      const mapOptions: google.maps.MapOptions = {
        center: location,
        zoom: 20,
        mapId: "3f60e97302b8c3",
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      // display with marker
      // const { AdvancedMarkerElement, PinElement } =
      //   (await google.maps.importLibrary(
      //     "marker"
      //   )) as google.maps.MarkerLibrary;

      // const pin = new PinElement({
      //   borderColor: "black",
      //   glyphColor: "black",
      // });
      // const marker = new AdvancedMarkerElement({
      //   map,
      //   position:location,
      //   content:pin.element
      // })
      nearbySearch();
    };
    if (location) {
      initMap();
    }
  }, [location]);

  return (
    <div
      id="map"
      ref={mapRef}
      className="w-full h-full relative overflow-hidden"
    ></div>
  );
}
