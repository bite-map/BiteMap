import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa6";
type FilterProps = {
  buttonActions: { [key: string]: () => void };
};
export default function Filter({ buttonActions }: FilterProps) {
  const [action, setAction] = useState<any>();
  const [fold, setFold] = useState<boolean>(false);
  useEffect(() => {
    console.log(action);
  }, [action]);
  return (
    <div className="relative w-32 font-medium h-80">
      <button
        className="bg-white w-full p-1 flex items-center justify-between rounded text-xs text-slate-500"
        onClick={() => {
          setFold(!fold);
        }}
      >
        <p className="w-full">Select filter</p>
        <FaChevronDown size={8} className="mr-1" />
      </button>
      {fold && (
        <ul className="bg-white mt-1 text-slate-500 text-xs">
          {/* map: function array, onclick = set to function, then click marker button to execute function*/}
          {Object.entries(buttonActions).map(([actionName, actionFunction]) => {
            return (
              <li className="p-1 hover:bg-slate-300">
                <button
                  key={actionName}
                  onClick={() => {
                    actionFunction();
                  }}
                >
                  {actionName}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
