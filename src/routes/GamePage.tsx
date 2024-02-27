"use client";

import { GameContextProvider, useGame } from "../logic/GameContext";
import { GameWrapper as GameInProgress } from "../components/GameInProgress";
import { useState } from "react";
import { GameWaitingRoom } from "../components/WaitingRoom";
import { useLoaderData } from "react-router-dom";
import { useFirebase } from "../logic/FirebaseContext";
import { Status } from "../logic/game_logic";

export default function GameContextWrapper() {
  const { gameId } = useLoaderData() as { gameId: string };
  return (
    <GameContextProvider gameId={gameId}>
      <GameLoadingWrapper />
    </GameContextProvider>
  );
}

function GameLoadingWrapper() {
  const { meta } = useGame();
  const { currentUser } = useFirebase();

  if (meta === undefined) return <p>Loading...</p>;
  if (meta === null) return <p>No such game found</p>;
  if (currentUser === undefined) return <p>Creating user...</p>;

  return <GameWaitOrPlayWrapper />;
}

const GameWaitOrPlayWrapper = () => {
  const { users, status } = useGame();
  const { currentUser } = useFirebase();

  const [joined, setJoined] = useState(
    () => users[currentUser!.uid] !== undefined
  );

  switch (status) {
    case Status.WAITING:
      return (
        <GameWaitingRoom
          joined={joined}
          joinGameCallback={() => setJoined(true)}
        />
      );
    case Status.IN_PROGRESS:
      if (joined) {
        return <GameInProgress />;
      } else {
        return <p>Game already started</p>;
      }
    case Status.FINISHED:
      return <p>Game finished</p>;
    default:
      throw new Error("Don't know how to handle status: " + status);
  }
};
