import { useState, useEffect } from "react";
import { Location } from "../global-component-types";
import { FaChevronDown } from "react-icons/fa6";
import {
  makeSightingMarkerUsingSighting,
  searchFoodTruck,
  clear,
} from "./geo-utils";
import {
  getSightingActiveInLastWeek,
  getSightingsOrderedByLastActiveCountConfirm,
} from "./filter-utils";
import { PostgrestError } from "@supabase/supabase-js";
type FilterProps = {
  google: any;
  map: any;
  displayPlacesMarker: boolean;
  setDisplayPlacesMarker: (param: boolean) => void;
  displaySightingsMarker: boolean;
  setDisplaySightingsMarker: (param: boolean) => void;
  sightings: any[] | undefined;
  setSighting: (param: any) => void;
  setSelectedSighting: (param: any) => void;
  location: Location;
  places: any[] | undefined;
  setPlaces: (param: any[]) => void;
};
export default function Filter({
  google,
  map,
  displayPlacesMarker,
  setDisplayPlacesMarker,
  displaySightingsMarker,
  setDisplaySightingsMarker,
  sightings,
  setSighting,
  setSelectedSighting,
  location,
  places,
  setPlaces,
}: FilterProps) {
  const [fold, setFold] = useState<boolean>(false);
  const buttonActionsCollect = {
    activeInLastWeek: async () => {
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
    popular: async () => {
      if (!displaySightingsMarker) {
        const data = await getSightingsOrderedByLastActiveCountConfirm();
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
      if (displaySightingsMarker && sightings) {
        clear(sightings);
        setSelectedSighting(null);
        setDisplaySightingsMarker(false);
      }
    },
    staticTrucks: () => {
      if (!displayPlacesMarker && location) {
        searchFoodTruck(google, map as google.maps.Map, setPlaces, location);
        setDisplayPlacesMarker(true);
      }
      if (displayPlacesMarker && places) {
        clear(places);
        setDisplayPlacesMarker(false);
      }
    },
    // TODO
    // getSightingActiveOnCurrentDayOfWeek: async () => {
    // },
  };

  const formatButtonName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };
  useEffect(() => {}, [setFold]);
  return (
    <div className="relative w-32 font-medium items-center h-10">
      <button
        className=" bg-white w-full h-8 p-1 mt-1 mb-1 flex items-center justify-between rounded text-xs text-slate-500 "
        onClick={() => {
          setFold(!fold);
        }}
      >
        <p className="w-full">Select filter</p>
        <FaChevronDown size={8} className="mr-1" />
      </button>
      {fold && (
        <ul className="absolute bg-white mt-1 text-slate-500 text-xs  ">
          {/* map: function array, onclick = set to function, then click marker button to execute function*/}
          {Object.entries(buttonActionsCollect).map(
            ([actionName, actionFunction]) => {
              return (
                <li
                  key={actionName}
                  className="flex items-center justify-center p-1 h-10  hover:bg-slate-300 border-l-0 border-r-0 border-t-0 border-b-1 border-gray-400 border"
                >
                  <button
                    className="relative items-start w-full h-full "
                    key={actionName}
                    onClick={() => {
                      actionFunction();
                    }}
                  >
                    <p className="text-start ">
                      {" "}
                      {formatButtonName(actionName)}
                    </p>
                  </button>
                </li>
              );
            }
          )}
        </ul>
      )}
    </div>
  );
}
