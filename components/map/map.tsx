"use client";

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import FoodTruckProfile from "../food-truck-profile";
const libs: Library[] = ["core", "maps", "places", "marker"];

const createInfoCard = (title: string, body: string) =>
  `<div class="map_infocard_content">
    <div class="map_infocard_title">${title}</div>
    <div class="map_infocard_body">${body}</div>
  </div>`;

export default function Map() {
  // references
  const mapRef = useRef<HTMLDivElement>(null);
  // const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  // state varaibles
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const [places, setPlaces] = useState<google.maps.places.Place[]>();
  const [truckProfile, setTruckProfile] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
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

  // searchFoodTruck
  async function searchFoodTruck() {
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
    } else {
      console.error("No results");
    }
  }

  function displayMarkerForTruck(places: google.maps.places.Place[]) {
    if (!map) return;
    places.map((place) => {
      // Style:
      const pinScaled = new google.maps.marker.PinElement({
        scale: 1.5,
        background: "#FBBC04",
        borderColor: "#137333",
        glyphColor: "white",
        glyph: "T",
      });
      // Place marker in map
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.location,
        title: place.displayName,
        content: pinScaled.element,
      });
      marker.addListener("click", () => {
        // TODO: pop up food truck info
        // FETCH from DB
        // pop up
        console.log(place.displayName);
        setTruckProfile(true);
      });
    });
  }
  async function addSighting() {
    // TODO: get user data
    // TODO: call route,
    // TODO - Route:
    //      1:decide if valid sighting
    //      2:insert to table
    console.log("new sighting");
  }

  // -----Effect-----
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

      // create a bound 10km in each direction from devices location
      const defaultBounds = {
        north: location.lat + 0.1,
        south: location.lat - 0.1,
        east: location.lng + 0.1,
        west: location.lng - 0.1,
      };

      // options for autocomplete
      const autocompleteOptions = {
        bounds: defaultBounds,
        componentRestrictions: { country: "jp" },
        fields: ["geometry", "name"], // geometry is the lat long
        strictBounds: false,
      };

      const autoCompleteEl = document.getElementById("search-bar");

      // setup autocomplete
      const gAutoComplete = new google.maps.places.Autocomplete(
        //placeAutoCompleteRef.current as HTMLInputElement,
        autoCompleteEl as HTMLInputElement,
        autocompleteOptions
      );

      setMap(gMap);
      setAutoComplete(gAutoComplete);
    }
  }, [isLoaded, location]);

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        const position = place.geometry?.location;

        if (position) {
          placeMarker(position, place.name as string);
        }
      });
    }
  }, [autoComplete]);

  useEffect(() => {
    if (places) {
      displayMarkerForTruck(places);
    }
  }, [places]);

  function placeMarker(location: google.maps.LatLng, name: string) {
    if (!map) return;

    map.setCenter(location);
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: location,
      title: "Marker",
    });

    const infoCard = new google.maps.InfoWindow({
      position: location,
      content: createInfoCard(name, name),
      maxWidth: 200,
    });

    infoCard.open({
      map: map,
      anchor: marker,
    });
  }
  // -----Effect-----

  return (
    <>
      {isLoaded && location ? (
        <>
          {truckProfile && (
            <FoodTruckProfile
              setTruckProfile={setTruckProfile}
            ></FoodTruckProfile>
          )}
          <button
            onClick={searchFoodTruck}
            className="outline outline-2 outline-solid"
          >
            Search trucks
          </button>
          <button
            onClick={addSighting}
            className="outline outline-2 outline-solid"
          >
            Confirm Sighting
          </button>
          <div
            id="map"
            ref={mapRef}
            className="w-full h-full relative overflow-hidden"
          ></div>
          {/* <input
            className="mt-3 bg-slate-300"
            type="text"
            ref={placeAutoCompleteRef}
          /> */}
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </>
  );
}
