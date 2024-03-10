import Status from "./GameStatus";

export const GameToolbar = () => {
  return (
    <div className="bg-slate-100 w-full h-10 shadow-lg shadow-black">
      <Status />
    </div>
  );
};
