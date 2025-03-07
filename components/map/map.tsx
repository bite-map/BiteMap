"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
// import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
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

  async function nearbySearch() {
    //@ts-ignore
    const { Place, SearchNearbyRankPreference } =
      (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    const request = {
      // required parameters
      fields: ["displayName", "location", "businessStatus"],
      locationRestriction: {
        center: location,
        radius: 1500,
      },
      // optional parameters
      includedPrimaryTypes: ["restaurant"],
    };
    //@ts-ignore
    const { places } = await Place.searchNearby(request);
    if (places.length) {
      console.log(places);

      const { LatLngBounds } = (await google.maps.importLibrary(
        "core"
      )) as google.maps.CoreLibrary;
      const bounds = new LatLngBounds();
      // Loop through and get all the results.
      places.forEach((place) => {
        console.log(place);
      });
    } else {
      console.log("No results");
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
        mapId: "MAIN_MAP",
      };
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      nearbySearch();
    };

    initMap();
  }, [location]);

  const fetchNearbyTrucks = async () => {
    // Restrict within the map viewport.
    let center = new google.maps.LatLng(52.369358, 4.889258);

    const request = {
      // required parameters
      fields: ["displayName", "location", "businessStatus"],
      locationRestriction: {
        center: center,
        radius: 500,
      },
      // optional parameters
      includedPrimaryTypes: ["restaurant"],
      maxResultCount: 5,
      language: "en-US",
      region: "us",
    };
    //@ts-ignore
    const { places } = await google.maps.Place.searchNearby(request);
    console.log(places);
  };
  useEffect(() => {
    // fetchNearbyTrucks();
  }, [mapRef]);
  return (
    <div ref={mapRef} className="w-full h-full relative overflow-hidden"></div>
  );
}
