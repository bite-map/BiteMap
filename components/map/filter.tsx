import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa6";
type FilterProps = {
  buttonActions: { [key: string]: () => void };
};
export default function Filter({ buttonActions }: FilterProps) {
  const [fold, setFold] = useState<boolean>(false);
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
          {Object.entries(buttonActions).map(([actionName, actionFunction]) => {
            return (
              <li className="flex items-center justify-center p-1 h-10  hover:bg-slate-300 border-l-0 border-r-0 border-t-0 border-b-1 border-gray-400 border">
                <button
                  className="relative items-start w-full "
                  key={actionName}
                  onClick={() => {
                    actionFunction();
                  }}
                >
                  <p className="text-start "> {formatButtonName(actionName)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
