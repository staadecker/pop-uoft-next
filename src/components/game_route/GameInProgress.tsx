import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../lexical-playground/App"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function GameWrapper() {
  return (
    <div className="flex flex-col">
      <GameToolbar />
      <div className="flex flex-row px-10 py-4">
        <Editor/>
      </div>
    </div>
  );
}

const GameToolbar = () => {
  return <div className="bg-slate-100 w-full h-10"></div>;
};
