import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Location } from "../global-component-types";
import { FaChevronDown } from "react-icons/fa6";
import {
  makeSightingMarkerUsingSighting,
  searchFoodTruck,
  clear,
  fetchSighting,
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
  setSelectedStatic: (place: any) => void;
};
export interface FilterMethods {
  resetButtonText: () => void;
}
const Filter = forwardRef<FilterMethods, FilterProps>((props, ref) => {
  const {
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
    setSelectedStatic,
  } = props;

  const [fold, setFold] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  // use ref to clear filter when reset button clicked
  useImperativeHandle(ref, () => ({
    resetButtonText: () => {
      setCurrentAction(null);
    },
  }));
  const buttonActionsCollect = {
    allSightings: async () => {
      if (displaySightingsMarker && sightings) {
        clear(sightings);
      }
      fetchSighting(
        location,
        map as google.maps.Map,
        setSighting,
        setSelectedSighting
      );
      setDisplaySightingsMarker(true);
    },
    activeInLastWeek: async () => {
      if (displaySightingsMarker && sightings) {
        clear(sightings);
      }

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
    },
    accurite: async () => {
      if (displaySightingsMarker && sightings) {
        clear(sightings);
      }

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
    },
    staticTrucks: () => {
      if (displayPlacesMarker && places) {
        clear(places);
        setDisplayPlacesMarker(false);
      }
      searchFoodTruck(
        google,
        map as google.maps.Map,
        setPlaces,
        location,
        setSelectedStatic
      );
      setDisplayPlacesMarker(true);
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
        <p className="w-full">
          {currentAction ? formatButtonName(currentAction) : `Select Sightings`}
        </p>
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
                      setCurrentAction(actionName);
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
});
export default Filter;
