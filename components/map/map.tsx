"use client";
import { useEffect, useRef, useState } from "react";
// api imports
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
// components / UI
import { LuRefreshCw } from "react-icons/lu";
import { FaSpinner, FaPlus, FaMapMarkerAlt, FaMinus } from "react-icons/fa";
import { Input } from "../ui/input";
import { createCurrentLocationPin } from "./createPinStyles";
import SightingConfirmCard from "./sighting-confirm-card";
import Filter from "./filter";
// types
import { Location, Sighting } from "../global-component-types";
import AddNewFoodTruckForm from "../food-truck/add-new-food-truck-form";
import AddSighting from "./add-sighting";
import {
  clear,
  createMarkerOnMap,
  createInfoCard,
  fetchSighting,
  makeSightingMarkerUsingSighting,
  searchFoodTruck,
  trackLocation,
  getLocation,
} from "./geo-utils";
import {
  getSightingActiveInLastWeek,
  getSightingsOrderedByLastActiveCountConfirm,
} from "./filter-utils";

import { ToastContainer } from "react-toastify";
import { createToast } from "@/utils/toast";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError, UserMetadata } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Load api library
const libs: Library[] = ["core", "maps", "places", "marker", "geocoding"];

export default function Map() {
  const router = useRouter();

  const supabase = createClient();

  // references
  const mapRef = useRef<HTMLDivElement>(null);
  const placeAutoCompleteRef = useRef<HTMLInputElement>(null);

  // state varaibles
  const [user, setUser] = useState<UserMetadata | undefined>(undefined);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState<Location>();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  // marker for tracking users location
  const [userMarker, setUserMarker] = useState<google.maps.Circle | null>(null);

  //google map food truck location with markers
  const [places, setPlaces] = useState<any[]>();
  const [displayPlacesMarker, setDisplayPlacesMarker] =
    useState<boolean>(false);

  //sighting location with markers
  const [sightings, setSighting] = useState<any[]>();
  const [displaySightingsMarker, setDisplaySightingsMarker] =
    useState<boolean>(false);

  //autocomplete location with markers
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [displaySelectedLocationMarker, setDisplaySelectedLocationMarker] =
    useState<boolean>(false);

  const [isAddingActive, setIsAddingActive] = useState<boolean>(false);
  //used to toggle add sighting / truck
  const [isDisplayedAddSighting, setIsDisplayedAddSighting] =
    useState<boolean>(false);
  const [isDisplayedAddTruck, setIsDisplayedAddTruck] =
    useState<boolean>(false);

  // current id of sighting to display
  const [selectedSighting, setSelectedSighting] = useState<any>();

  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: string;
  } | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
    version: "weekly",
  });

  // toggle display to add sighting
  const handleToggleAddSighting = () => {
    setIsDisplayedAddSighting(!isDisplayedAddSighting);
  };
  // toggle display to add truck
  const handleToggleAddTruck = () => {
    setIsDisplayedAddTruck(!isDisplayedAddTruck);
  };
  const handleToggleAddButton = () => {
    // if is opening, close and set add sighting, add truck, add btn to false
    if (isAddingActive) {
      setIsDisplayedAddSighting(false);
      setIsDisplayedAddTruck(false);
    } else {
      setIsDisplayedAddSighting(true);
    }
    setIsAddingActive(!isAddingActive);
  };
  // show sighting confirm card

  // maybe pass all of those stuff with setters to filter component when cleaning up the map component
  const buttonActions = {
    searchInGoogle: () => {
      if (!displayPlacesMarker && location) {
        searchFoodTruck(google, map as google.maps.Map, setPlaces, location);
        setDisplayPlacesMarker(true);
      }
      if (displayPlacesMarker && places) {
        clear(places);
        setDisplayPlacesMarker(false);
      }
    },
    sightingActiveInLastWeek: async () => {
      if (!displaySightingsMarker) {
        const data = await getSightingActiveInLastWeek();
        if (data instanceof PostgrestError) {
          console.error(data);
          return;
        }
        makeSightingMarkerUsingSighting(
          map as google.maps.Map,
          setSighting,
          setSelectedSighting,
          data
        );
        setDisplaySightingsMarker(true);
      }
      if (displaySightingsMarker && sightings) {
        clear(sightings);
        setSelectedSighting(null);
        setDisplaySightingsMarker(false);
      }
    },
    popularSightings: async () => {
      if (!displaySightingsMarker) {
        const data = await getSightingsOrderedByLastActiveCountConfirm();
        console.log(data);
        if (data instanceof PostgrestError) {
          console.error(data);
          return;
        }
        makeSightingMarkerUsingSighting(
          map as google.maps.Map,
          setSighting,
          setSelectedSighting,
          data
        );
        setDisplaySightingsMarker(true);
        if (displaySightingsMarker && sightings) {
          clear(sightings);
          setSelectedSighting(null);
          setDisplaySightingsMarker(false);
        }
      }
    },

    // TODO
    // getSightingActiveOnCurrentDayOfWeek: async () => {
    // },
  };
  // -----Effect-----
  useEffect(() => {
    // get logged in user
    (async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data.session?.user.user_metadata);
    })();

    let id: any;
    try {
      id = trackLocation(setLocation);
    } catch (error) {
      navigator.geolocation.clearWatch(id);
      getLocation(setLocation);
      // Toast error (currently is using static location)
    }
  }, []);

  useEffect(() => {
    // updates the users marker when position changes
    if (userMarker) {
      map?.setCenter(location as Location);
      userMarker.setCenter(location as Location);
    }

    // if the user marker isn't already created, create one
    if (map && !userMarker) {
      setUserMarker(
        new google.maps.Circle({
          map: map,
          center: location,
          radius: 10,
          fillColor: "#ef6262",
          fillOpacity: 0.6,
          strokeColor: "#ef6262",
          strokeWeight: 2,
        })
      );
    }
  }, [map, location]);

  useEffect(() => {
    if (isLoaded && location && map === null) {
      const mapOptions = {
        center: location,
        zoom: 17,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
        mapId: "3f60e97302b8c3",
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
    if (autoComplete && map) {
      // set center to place in auto complete
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();

        if (place) {
          // drop marker
          const selectedLocationMarker = createMarkerOnMap(
            place.geometry?.location as google.maps.LatLng,
            createCurrentLocationPin,
            "selectedLocation",
            createInfoCard(
              place.formatted_address as string,
              place.formatted_address as string
            ),
            map
          );
          setSelectedLocation(selectedLocationMarker);

          map?.setCenter(place.geometry?.location as google.maps.LatLng);
        }
      });
    }
  }, [autoComplete]);
  // turn off after adding truck / sighting
  useEffect(() => {
    if (!isDisplayedAddTruck && !isDisplayedAddSighting && isAddingActive) {
      setIsAddingActive(false);
    }
  }, [isDisplayedAddSighting, isDisplayedAddTruck]);
  useEffect(() => {
    if (isLoaded && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      setGeocoder(geocoder);
    }
  }, [isLoaded]);
  // show toast
  useEffect(() => {
    if (toastMessage?.message && toastMessage.type) {
      const toast = createToast(toastMessage?.message, toastMessage?.type);
      if (toast) {
        toast();
      }
    }
    return () => {
      setToastMessage(null);
    };
  }, [toastMessage]);
  // -----Effect-----

  return (
    <>
      {isLoaded && location ? (
        <div className="flex flex-col h-full">
          {/* MAP */}
          <div id="map" ref={mapRef} className="grow"></div>
          {/* MAP */}

          <div className="absolute w-full flex flex-row justify-center items-center">
            <div className="relative flex p-2 gap-1 w-full">
              <div className="flex gap-2 w-full justify-center h-10 items-center">
                <button
                  className="h-8 w-8 bg-primary flex items-center justify-center rounded-xl  "
                  onClick={async () => {
                    if (!displaySightingsMarker) {
                      fetchSighting(
                        location,
                        map as google.maps.Map,
                        setSighting,
                        setSelectedSighting
                      );
                      setDisplaySightingsMarker(true);
                    }
                    if (displaySightingsMarker && sightings) {
                      clear(sightings);
                      setSelectedSighting(null);
                      setDisplaySightingsMarker(false);
                    }
                  }}
                >
                  <FaMapMarkerAlt className="fill-white" />
                </button>
                <Filter buttonActions={buttonActions} />

                {/* display sighitngs */}
              </div>
              <Input
                className="h-9 w-[250px] ml-auto"
                type="text"
                ref={placeAutoCompleteRef}
                placeholder="Search by location"
              />
            </div>

            {selectedSighting && (
              <div className="absolute flex flex-col h-fit w-fit justify-center items-center top-16 bg-white rounded-xl border border-gray-300">
                <SightingConfirmCard
                  user={user}
                  setToastMessage={setToastMessage}
                  sighting={selectedSighting}
                  setSelectedSighting={setSelectedSighting}
                />
              </div>
            )}

            {isAddingActive && geocoder && (
              <div className="absolute flex flex-col h-90 w-96 justify-center items-center top-16 ">
                <div className="relative w-fit h-fit items-center">
                  {isDisplayedAddSighting && (
                    <div className="relative w-80 h-fit bg-white p-2  border border-gray-300 rounded-xl ">
                      <AddSighting
                        setToastMessage={setToastMessage}
                        handleToggleAddSighting={handleToggleAddSighting}
                        handleToggleAddTruck={handleToggleAddTruck}
                        geocoder={geocoder}
                      />
                    </div>
                  )}
                </div>

                <div className="relative w-fit h-fit items-center">
                  {isDisplayedAddTruck && (
                    <div className="relative w-fit h-fit bg-white p-2  border border-gray-300 rounded-xl ">
                      <AddNewFoodTruckForm
                        setToastMessage={setToastMessage}
                        handleToggleAddTruck={handleToggleAddTruck}
                        handleToggleAddSighting={handleToggleAddSighting}
                        location={location}
                        geocoder={geocoder}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <ToastContainer></ToastContainer>
          {/* add new button:  */}
          <div
            className="absolute bottom-0 right-0 m-3 inline-flex items-center justify-center bg-primary rounded-full w-14 h-14"
            onClick={() => {
              if (!user) {
                return router.push("/sign-in?error=Not signed in");
              }
              handleToggleAddButton();
            }}
          >
            <FaPlus
              className="focus:outline-none focus:ring-4 focus:shadow font-sans rounded-full  "
              color="white"
              fontSize={16}
            />
          </div>
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
