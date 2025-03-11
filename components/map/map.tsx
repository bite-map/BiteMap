"use client";
import { useEffect, useRef, useState } from "react";
// api imports
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
// ui imports
import { LuRefreshCw } from "react-icons/lu";
import { GiConfirmed } from "react-icons/gi";
import { FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import { Input } from "../ui/input";
import IconButton from "../icon-button";
// components
import FoodTruckProfile from "../food-truck/food-truck-profile";
// types
import { Location } from "../global-component-types";

import {
  createTruckPin,
  createCurrentLocationPin,
  createSightingPin,
} from "./createPinStyles";
// Load api library
const libs: Library[] = ["core", "maps", "places", "marker"];

const createInfoCard = (title: string, body: string) =>
  `<div class="map_infocard_content">
    <div class="map_infocard_title">${title}</div>
    <div class="map_infocard_body">${body}</div>
  </div>`;

export default function Map() {
  // references
  const mapRef = useRef<HTMLDivElement>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  // state varaibles
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState<Location>();
  const [places, setPlaces] = useState<google.maps.places.Place[]>();
  const [sightings, setSightings] = useState<any>();
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
      textQuery: "Food Truck",
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
  // TODO: refactor
  function createMarker(
    location: Location,
    title: string = "",
    createPin: Function
  ) {
    if (!map) return;
    const LatLng = new google.maps.LatLng(location.lat, location.lng);
    // Pin Style:
    const pin = createPin(google);
    // Place marker in map
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: LatLng,
      title: title,
      content: pin.element,
    });
    marker.addListener("click", () => {
      // TODO: pop up food truck info
      // FETCH from DB
      // pop up
      setTruckProfile(true);
    });
    return marker;
  }
  async function addSighting() {
    if (!location) {
      return;
    }
    const res = await fetch(
      `../api/sighting?lat=${location.lat}&lng=${location.lng}`,
      {
        method: "POST",
      }
    );
    const data = await res.json();
    console.log(data);
  }

  async function getSighting() {
    if (!location) {
      return;
    }
    const res = await fetch(
      `../api/sighting?lat=${location.lat}&lng=${location.lng}`
    );
    const sightings = await res.json();

    if (sightings.length > 0) {
      setSightings(sightings);
      sightings.forEach((sighting: any) => {
        const location: Location = {
          lat: sighting.lat as number,
          lng: sighting.lng as number,
        };
        createMarker(
          location,
          sighting.displayName as string,
          createSightingPin
        );
      });
    }
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

      // setup autocomplete
      const gAutoComplete = new google.maps.places.Autocomplete(
        placeAutoCompleteRef.current as HTMLInputElement,
        autocompleteOptions
      );

      setMap(gMap);
      setAutoComplete(gAutoComplete);
    }
  }, [isLoaded, location]);

  useEffect(() => {
    if (autoComplete) {
      // set center to place in auto complete
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        const position = {
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        } as Location;
        // drop marker
        if (position) {
          const marker = createMarker(
            position,
            place.name as string,
            createCurrentLocationPin
          );
          map?.setCenter(place.geometry?.location as google.maps.LatLng);
          // set info card and open
          const infoCard = new google.maps.InfoWindow({
            position: location,
            content: createInfoCard(
              place.name as string,
              place.adr_address as string
            ),
            maxWidth: 200,
          });
          infoCard.open({
            map: map,
            anchor: marker,
          });
        }
      });
    }
  }, [autoComplete]);

  useEffect(() => {
    if (places) {
      places.forEach((place) => {
        const location: Location = {
          lat: place.location?.lat() as number,
          lng: place.location?.lng() as number,
        };
        createMarker(location, place.displayName as string, createTruckPin);
      });
    }
  }, [places]);

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
          <div className="flex p-2  bg-muted">
            <div className="flex gap-1">
              <IconButton Icon={LuRefreshCw} callback={searchFoodTruck} />
              <IconButton Icon={GiConfirmed} callback={addSighting} />
              <IconButton Icon={FaMapMarkerAlt} callback={getSighting} />
            </div>
            <Input
              className="h-9 w-[250px] ml-auto"
              type="text"
              ref={placeAutoCompleteRef}
            />
          </div>

          <div
            id="map"
            ref={mapRef}
            className="w-full h-full relative overflow-hidden"
          ></div>
        </>
      ) : (
        <div className="flex justify-center items-center gap-2 text-lg mt-2">
          Loading map{" "}
          <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
        </div>
      )}
    </>
  );
}
