import { useGame } from "../game_logic/GameContext";
import { addUserToDb } from "../firebase/db_queries";
import { UserCard } from "./UserCard";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { GameToolbar } from "./GameToolbar";

export function GameWaitingRoom() {
  return (
    <div className="h-full w-full flex flex-col">
      <GameToolbar />
      <div className="grow flex flex-col space-y-4 px-4 py-8">
        <UserList />
        <JoinButton />
      </div>
    </div>
  );
}

export const UserList = () => {
  const { state } = useGame();
  const users = Object.keys(state.context.users);
  return (
    <div className="grow flex justify-center align-center">
      <div className="grow max-w-xl flex flex-col bg-surface rounded-xl overflow-y-scroll border-stone-400 border-8 text-center py-4 px-2 gap-4">
        <p className="text-xl">
          {users.length} {users.length == 1 ? "player has" : "players have"}{" "}
          joined
        </p>
        <div className="grow flex flex-wrap bg-surface rounded-xl items-start content-start justify-center gap-4">
          {users.map((userId) => (
            <UserCard userId={userId} key={userId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const JoinButton = () => {
  const { state } = useGame();

  const [joining, setJoining] = useState(false);

  const joinGame = async () => {
    setJoining(true);
    await addUserToDb(state.context);
    setJoining(false);
  };

  const joined = state.context.currentUserUid in state.context.users;

  return (
    <>
      <div className="flex justify-center h-14">
        <LoadingButton
          className="grow flex rounded-2xl max-w-md justify-center items-center gap-3 bg-primarycontainer"
          variant="contained"
          onClick={joinGame}
          disabled={joining || joined}
          loading={joining}
        >
          {!joined && !joining && (
            <img src="/icons/play.svg" width={24} height={24} alt="Play" />
          )}
          <div className="text-onprimarycontainer text-lg font-bold">
            {joined ? "You're in!" : "Join Game"}
          </div>
        </LoadingButton>
      </div>
    </>
  );
};
