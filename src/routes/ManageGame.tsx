import { useLoaderData } from "react-router-dom";
import { GameContextProvider, useGame } from "../game_logic/GameContext";
import { QRCodeSVG } from "qrcode.react";
import { UserList } from "../components/WaitingRoom";
import Loading from "../components/Loading";
import MessagePage from "../components/MessagePage";
import { GameToolbar } from "../components/GameToolbar";

const ManageGame = () => {
  const { gameId } = useLoaderData() as { gameId: string };

  return (
    <GameContextProvider gameId={gameId} isPlayer={false}>
      <ManageGameRouter />
    </GameContextProvider>
  );
};

const ManageGameRouter = () => {
  const { state } = useGame();

  switch (state.value) {
    case "loading_game":
    case "enter_game":
    case "loaded":
      return <Loading fullScreen />;
    case "game_not_found":
      return <MessagePage msg="Oops. This link doesn't exist!" error />;
    case "not_enough_players":
      return <MessagePage msg="Not enough players :/" />;
    case "waiting":
      return <ManageGamePage />;
    case "in_progress":
    case "saving_work":
    case "already_started":
    case "loading_work":
      return <MessagePage msg="Game in progress!" />;
    case "finished":
      return <MessagePage msg="Game finished!" />;
    default:
      return (
        <MessagePage
          msg={"Oops. The state '" + state.value + "' is unexpected."}
          error
        />
      );
  }
};

const ManageGamePage = () => {
  const { state } = useGame();

  const link = import.meta.env.VITE_DOMAIN + "/" + state.context.gameId;

  return (
    <div className="flex flex-col">
      <GameToolbar />
      <div className="flex flex-row h-full w-full p-8 items-stretch">
        <div className="flex flex-col items-center basis-1/2">
          <h1 className="text-4xl py-4">Join Game</h1>
          <div className="rounded-xl bg-white text-center space-y-0 pb-8">
            <QRCode />
            <a
              href={link}
              className="underline text-4xl font-bold text-blue-900 py-8"
              target="_blank"
            >
              {link.split("//")[1]}
            </a>
          </div>
        </div>
        <div className="basis-1/2 flex flex-col">
          <UserList />
        </div>
      </div>
    </div>
  );
};

const QRCode = () => {
  const { state } = useGame();
  return (
    <div className="p-8 ">
      <QRCodeSVG
        value={import.meta.env.DOMAIN + state.context.gameId}
        size={300}
      />
    </div>
  );
};

export default ManageGame;
