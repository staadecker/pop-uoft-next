"use client";

import { Login } from "../../components/login";
import { FirebaseContext } from "../../backend/firebase";
import {
  GameContext,
  GameContextProvider,
  addUserToGame,
} from "../../backend/fetchGame";
import { UserCard } from "../../components/UserCard";
import { GameInProgress } from "../../components/GameInProgress";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GameWrapper() {
  const pathname = usePathname();
  if (!pathname) throw new Error("No search params");
  const gameId = pathname.split("/")[1];
  if (typeof gameId !== "string") throw new Error("Failed to parse game id");

  return (
    <GameContextProvider gameId={gameId}>
      <GameExistsWrapper />
    </GameContextProvider>
  );
}

function GameExistsWrapper() {
  const { meta, users } = useContext(GameContext);
  const { currentUser } = useContext(FirebaseContext);

  if (meta === null) return <p>No such game found</p>;
  if (meta === undefined || users === undefined) return <p>Loading game...</p>;

  if (currentUser === undefined) return <p>Loading authentication...</p>;
  if (currentUser === null) return <Login />;

  return <GameContent />;
}

export const GameContent = () => {
  const { meta } = useContext(GameContext);
  const timeBeforeStart =
    meta!.startTime.toDate().getTime() - new Date().getTime();

  const [gameStarted, setGameStarted] = useState(timeBeforeStart <= 0);

  if (timeBeforeStart > 0)
    setTimeout(() => setGameStarted(true), timeBeforeStart);

  return gameStarted ? <GameInProgress /> : <GameWaitingRoom />;
};

const GameWaitingRoom = () => {
  const { db } = useContext(FirebaseContext);
  const { meta, users } = useContext(GameContext);

  const getTimeRemaining = () => {
    const now = new Date();
    const startTime = meta!.startTime.toDate();
    const timeDiff = startTime.getTime() - now.getTime();
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = ((timeDiff % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  const joinGame = async () => {
    // TODO autogenerate name
    setJoining(true);
    await addUserToGame(db, props.gameId, "Bat");
    setJoined(true);
  };

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="grow bg-background flex justify-center px-4 py-8">
        <div className="max-w-3xl flex flex-col space-y-4">
          <div className="grow basis-0 flex flex-col bg-surface rounded-xl overflow-y-scroll border border-stone-400 text-center py-4 px-2 gap-4">
            <p>
              {Object.keys(users!).length} players have joined
            </p>
            <div className="grow flex flex-wrap bg-surface rounded-xl items-start content-start justify-center gap-4">
              {Object.keys(users!).map((userKey) => (
                <UserCard name={users![userKey].displayName} />
              ))}
            </div>
          </div>
          {joined ? (
            <div className="text-center text-3xl">
              Game starts in <strong>{timeRemaining}</strong>
            </div>
          ) : (
            <div className="flex justify-center h-14">
              <button
                className="grow flex bg-primarycontainer hover:shadow-md shadow rounded-2xl max-w-md justify-center items-center gap-3"
                onClick={joinGame}
                disabled={joining}
              >
                <img src="/icons/play.svg" className="w-6 h-6" />
                <div className="text-onprimarycontainer text-lg font-bold">
                  Join Game
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="italic text-sm bg-slate-100 px-4 py-2 text-right">
        Signed in as {props.user.email}
      </div>
    </div>
  );
};
