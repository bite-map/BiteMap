"use client";
import { useEffect, useRef, useState } from "react";
// api imports
import { InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
// components / UI
import { LuRefreshCw } from "react-icons/lu";
import { FaSpinner, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { Input } from "../ui/input";
import IconButton from "../icon-button";
import {
  createTruckPin,
  createCurrentLocationPin,
  createSightingPin,
} from "./createPinStyles";
// types
import { Location } from "../global-component-types";
import { getTruckBySightingId } from "@/app/database-actions";
import { SubmitButton } from "../submit-button";
import AddNewFoodTruckForm from "../food-truck/add-new-food-truck-form";
import AddSighting from "./add-sighting";
import { mapStyles } from "./style-setting";
import { clear } from "./geo-utils";
// Load api library
const libs: Library[] = ["core", "maps", "places", "marker"];

const createInfoCard = (title: string, body: string) =>
  // TODO: a link, route to google map in new page to navigate to place
  `<div class="map_infocard_content">
    <div class="map_infocard_title">${title}</div>
       <Link href="/truck-profile/${1}"></Link>
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
  //
  const [places, setPlaces] = useState<google.maps.places.Place[]>();
  const [isDisplayedAddSighting, setIsDisplayedAddSighting] =
    useState<boolean>(false);
  const [isDisplayedAddTruck, setIsDisplayedAddTruck] =
    useState<boolean>(false);
  // current id of sighting to display
  const [sightingId, setSightingId] = useState<number>();
  // Toggle display
  // store sighting markers , display or remove
  const [sightings, setSighting] = useState<any[]>();
  // Used to clean up markers
  const [placeMarker, setPlaceMarker] = useState<google.maps.places.Place[]>();
  const [locationMarker, setLocationMarker] = useState<any[]>();
  const [userLocationMarker, setUserLocationMarker] = useState<any[]>();

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
  // Create marker
  function createMarker(
    location: Location,
    title: string = "",
    createPin: Function
  ): google.maps.marker.AdvancedMarkerElement | undefined {
    if (!map) return;
    const LatLng = new google.maps.LatLng(location.lat, location.lng);
    // create pin style:
    const pin = createPin(google);
    // Place marker in map
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: LatLng,
      title: title,
      content: pin.element,
    });
    return marker;
  }

  // toggle display to add sighting
  const handleToggleAddSighting = () => {
    setIsDisplayedAddSighting(!isDisplayedAddSighting);
  };

  // toggle display to add sighting
  const handleToggleAddTruck = () => {
    setIsDisplayedAddTruck(!isDisplayedAddTruck);
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

  async function addSighting(truck_id: number = 2) {
    if (!location) {
      return;
    }

    const res = await fetch(
      `../api/sighting?lat=${location.lat}&lng=${location.lng}&truck_id=${truck_id}`,
      {
        method: "POST",
      }
    );
    const data = await res.json();
    console.log(data);
    // TODO: inform add data successfully and disappear(use effect and clean up)
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
      // store sightings

      sightings.forEach((sighting: any) => {
        const location: Location = {
          lat: sighting.lat as number,
          lng: sighting.lng as number,
        };
        const marker = createMarker(
          location,
          sighting.displayName as string,
          createSightingPin
        );
        if (marker) {
          marker.addListener("click", async () => {
            const foodTruck = await getTruckBySightingId(sighting.id);
            const infoWindowContent = `
      <div>
         <a href="/truck-profile/${foodTruck.id}" >GO TRUCK</a>
      </div>
    `;
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoWindowContent,
            });
            infoWindow.open(map, marker);
            // await supabase get truck id by sighting id
          });
        }
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
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
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
    const markers: any = [];
    // clean
    if (places) {
      places.forEach((place) => {
        const location: Location = {
          lat: place.location?.lat() as number,
          lng: place.location?.lng() as number,
        };
        const marker = createMarker(
          location,
          place.displayName as string,
          createTruckPin
        );
        if (marker) {
          const infoCard = new google.maps.InfoWindow({
            position: location,
            content: createInfoCard(
              place.displayName as string,
              place.adrFormatAddress as string
            ),
            maxWidth: 200,
          });
          const clickListener = marker.addListener("click", () => {
            infoCard.open({
              map: map,
              anchor: marker,
            });
          });

          markers.push({ marker, infoCard, clickListener });
        }
      });
    }
  }, [places, map, sightings]);

  // -----Effect-----

  return (
    <>
      {isLoaded && location ? (
        <div className="flex flex-col h-full">
          <div className="relative flex p-2  bg-muted gap-1 border-b-[1.5px] border-primary">
            <div className="flex gap-1">
              <IconButton Icon={FaMapMarkerAlt} callback={searchFoodTruck} />
              <IconButton
                Icon={FaPlus}
                callback={() => {
                  handleToggleAddSighting();
                }}
              />
              <IconButton Icon={LuRefreshCw} callback={getSighting} />
            </div>
            <Input
              className="h-9 w-[250px] ml-auto"
              type="text"
              ref={placeAutoCompleteRef}
            />
            {isDisplayedAddSighting && (
              <AddSighting handleToggleAddSighting={handleToggleAddSighting} />
            )}
          </div>

          <div id="map" ref={mapRef} className="grow"></div>
          <button
            className="bg-primary text-background"
            onClick={handleToggleAddTruck}
          >
            Add truck (TEST)
          </button>
          {isDisplayedAddTruck && (
            <AddNewFoodTruckForm handleToggle={handleToggleAddTruck} />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 text-lg mt-2">
          Loading map{" "}
          <FaSpinner className="animate-[spin_2s_ease-in-out_infinite] text-primary" />
        </div>
      )}
    </>
  );
}
