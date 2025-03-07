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
  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
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
    };

    initMap();
  }, [location]);
  return (
    <div ref={mapRef} className="w-full h-full relative overflow-hidden"></div>
  );
}
