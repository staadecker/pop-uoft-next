import App from "./lexical/App";

export default function GameWrapper() {
  return (
    <div className="flex flex-col">
      <GameToolbar />
      <div className="flex flex-row px-10 py-4">
        <App/>
      </div>
    </div>
  );
}

const GameToolbar = () => {
  return <div className="bg-slate-100 w-full h-10"></div>;
};
