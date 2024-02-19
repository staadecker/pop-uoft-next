"use client";

import { Login } from "../login";
import { FirebaseContext } from "../../backend/firebase";
import { GameContext, GameContextProvider } from "../../backend/fetchGame";
import GameInProgress from "./GameInProgress";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GameWaitingRoom from "./WaitingRoom";

export default function GameContextWrapper() {
  const pathname = usePathname();
  if (!pathname) throw new Error("No search params");
  const gameId = pathname.split("/")[1];
  if (typeof gameId !== "string") throw new Error("Failed to parse game id");

  return (
    <GameContextProvider gameId={gameId}>
      <GameLoadingWrapper />
    </GameContextProvider>
  );
}

function GameLoadingWrapper() {
  const { meta, users } = useContext(GameContext);
  const { currentUser } = useContext(FirebaseContext);

  if (meta === null) return <p>No such game found</p>;
  if (meta === undefined || users === undefined) return <p>Loading game...</p>;

  if (currentUser === undefined) return <p>Loading authentication...</p>;
  if (currentUser === null) return <Login />;

  return <GameWaitOrPlayWrapper />;
}

const GameWaitOrPlayWrapper = () => {
  const { meta, users } = useContext(GameContext);
  const { currentUser } = useContext(FirebaseContext);

  const [joined, setJoined] = useState(
    () => users![currentUser!.uid] !== undefined
  );
  const [gameStarted, setGameStarted] = useState(
    () => meta!.startTime.toDate().getTime() <= new Date().getTime()
  );

  useEffect(() => {
    if (!gameStarted) {
      const timer = setTimeout(
        () => setGameStarted((_) => true),
        meta!.startTime.toDate().getTime() - new Date().getTime()
      );
      return () => clearTimeout(timer);
    }
  }, [meta]);

  return gameStarted && joined ? (
    <GameInProgress />
  ) : (
    <GameWaitingRoom joinGameCallback={() => setJoined(true)} joined={joined} />
  );
};
