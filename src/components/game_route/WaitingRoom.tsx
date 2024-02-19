import { GameContext, addUserToGame } from "@/backend/fetchGame";
import { FirebaseContext } from "@/backend/firebase";
import { UserCard } from "@/components/UserCard";
import Image from "next/image";
import { useContext, useCallback, useState, useEffect } from "react";

export default function GameWaitingRoom({
  joinGameCallback,
  joined,
}: {
  joinGameCallback: () => void;
  joined: boolean;
}) {
  const { db, auth } = useContext(FirebaseContext);
  const { meta, users, gameId } = useContext(GameContext);

  const getTimeRemaining = useCallback(() => {
    const timeDiff = meta!.startTime.toDate().getTime() - new Date().getTime();
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = ((timeDiff % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [meta]);

  const [joining, setJoining] = useState(false);

  const joinGame = async () => {
    setJoining(true);
    // TODO autogenerate name
    await addUserToGame(db, gameId, auth.currentUser!.uid, "Bat");
    joinGameCallback();
  };

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="grow bg-background flex justify-center px-4 py-8">
        <div className="max-w-3xl flex flex-col space-y-4">
          <div className="grow basis-0 flex flex-col bg-surface rounded-xl overflow-y-scroll border border-stone-400 text-center py-4 px-2 gap-4">
            <p>{Object.keys(users!).length} players have joined</p>
            <div className="grow flex flex-wrap bg-surface rounded-xl items-start content-start justify-center gap-4">
              {Object.keys(users!).map((userKey) => (
                <UserCard name={users![userKey].displayName} key={userKey} />
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
                className="grow flex bg-primarycontainer hover:shadow-md shadow rounded-2xl max-w-md justify-center items-center gap-3 cursor-pointer"
                onClick={joinGame}
                disabled={joining}
              >
                <Image
                  src="/icons/play.svg"
                  width={24}
                  height={24}
                  alt="Play"
                />
                <div className="text-onprimarycontainer text-lg font-bold">
                  Join Game
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="italic text-sm bg-slate-100 px-4 py-2 text-right">
        Signed in as {auth.currentUser!.email}
      </div>
    </div>
  );
}
