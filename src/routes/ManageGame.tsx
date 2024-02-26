import { Link, useLoaderData } from "react-router-dom";
import { GameContext, GameContextProvider } from "../backend/game";
import { QRCodeSVG } from "qrcode.react";
import { JoinButton, UserList } from "../components/WaitingRoom";
import { useContext } from "react";
import { GameStatus } from "../components/GameStatus";

const ManageGame = () => {
  const { gameId } = useLoaderData() as { gameId: string };

  const link = process.env.DOMAIN + "/" + gameId;

  return (
    <GameContextProvider gameId={gameId} waitForLoad>
      <div className="flex flex-col">
        <GameStatus/>
        <div className="flex flex-row items-center h-screen w-screen">
          <div className="flex flex-col items-center basis-1/2 space-y-8">
            <h1 className="text-4xl font-bold">Join Game at</h1>
            <a
              href={link}
              className="underline text-6xl font-bold"
              target="_blank"
            >
              {link.split("//")[1]}
            </a>
            <QRCode />
          </div>
          <div className="basis-1/2 bg-red-50">
            <UserList />
          </div>
        </div>
      </div>
    </GameContextProvider>
  );
};

const QRCode = () => {
  const { gameId } = useContext(GameContext);
  return (
    <div className="p-8 bg-white">
      <QRCodeSVG value={process.env.DOMAIN + gameId} size={300} />
    </div>
  );
};

export default ManageGame;
