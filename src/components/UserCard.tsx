import React from "react";

export const UserCard = (props: {name: string}) => (
  <div className="p-2 bg-white rounded-lg shadow hover:shadow-md justify-start items-center gap-2 flex transition-height ease-in duration-500">
    <div className="w-6 h-6 rounded-full justify-center items-center flex bg-black">
      <img src={`/avatars/${props.name}.png`} />
    </div>
    <div className="text-black text-xs cursor-default">
      Anonymous {props.name}
    </div>
  </div>
);
