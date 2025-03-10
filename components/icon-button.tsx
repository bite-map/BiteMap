import React from "react";

type IconButtonProps = {
  Icon: React.ElementType;
  callback: () => void;
};

export default function IconButton({ Icon, callback }: IconButtonProps) {
  return (
    <button
      onClick={callback}
      className="bg-primary p-2 text-primary-foreground rounded-xl flex-none w-9 h-9 flex justify-center items-center"
    >
      <Icon />
    </button>
  );
}
