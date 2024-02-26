"use client";

import { FirebaseContext } from "../backend/firebase";
import { GameContext, GameContextProvider } from "../backend/game";
import { GameWrapper as GameInProgress } from "../components/GameInProgress";
import { useContext, useEffect, useState } from "react";
import { GameWaitingRoom } from "../components/WaitingRoom";
import { useLoaderData } from "react-router-dom";

export default function GameContextWrapper() {
  const { gameId } = useLoaderData() as { gameId: string };
  return (
    <GameContextProvider gameId={gameId} waitForLoad>
      <GameLoadingWrapper />
    </GameContextProvider>
  );
}

function GameLoadingWrapper() {
  const { meta } = useContext(GameContext);
  const { currentUser } = useContext(FirebaseContext);

  if (meta === null) return <p>No such game found</p>;
  if (currentUser === undefined) return <p>Creating user...</p>;

  return <GameWaitOrPlayWrapper />;
}

const GameWaitOrPlayWrapper = () => {
  const { meta, users } = useContext(GameContext);
  const { currentUser } = useContext(FirebaseContext);

  const [joined, setJoined] = useState(
    () => users[currentUser!.uid] !== undefined
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
