import { GameContext, addUserToGame } from "../backend/game";
import { FirebaseContext } from "../backend/firebase";
import { UserCard } from "./UserCard";
import { useContext, useState } from "react";
import { GameStatus } from "./GameStatus";

export function GameWaitingRoom({
  joinGameCallback,
  joined,
}: {
  joinGameCallback: () => void;
  joined: boolean;
}) {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="grow bg-background flex justify-center px-4 py-8">
        <div className="max-w-3xl flex flex-col space-y-4 min-w-80">
          <UserList />
          <JoinButton joined={joined} joinGameCallback={joinGameCallback} />
        </div>
      </div>
    </div>
  );
}

export const UserList = () => {
  const { users } = useContext(GameContext);
  return (
    <div className="grow basis-0 flex flex-col bg-surface rounded-xl overflow-y-scroll border border-stone-400 text-center py-4 px-2 gap-4">
      <p>
        {Object.keys(users!).length}{" "}
        {Object.keys(users!).length == 1 ? "player has" : "players have"} joined
      </p>
      <div className="grow flex flex-wrap bg-surface rounded-xl items-start content-start justify-center gap-4">
        {Object.keys(users!).map((userKey) => (
          <UserCard {...users![userKey]} key={userKey} />
        ))}
      </div>
    </div>
  );
};

export const JoinButton = ({ joined, joinGameCallback }) => {
  const { db, auth } = useContext(FirebaseContext);
  const { gameId } = useContext(GameContext);


  const [joining, setJoining] = useState(false);

  const joinGame = async () => {
    setJoining(true);
    // TODO autogenerate name
    await addUserToGame(db, gameId, auth.currentUser!.uid);
    joinGameCallback();
  };

  return (
    <>
      {joined ? (
        <GameStatus />
      ) : (
        <div className="flex justify-center h-14">
          <button
            className="grow flex bg-primarycontainer hover:shadow-md shadow rounded-2xl max-w-md justify-center items-center gap-3 cursor-pointer"
            onClick={joinGame}
            disabled={joining}
          >
            <img src="/icons/play.svg" width={24} height={24} alt="Play" />
            <div className="text-onprimarycontainer text-lg font-bold">
              Join Game
            </div>
          </button>
        </div>
      )}
    </>
  );
};
