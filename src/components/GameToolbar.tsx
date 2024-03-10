export const GameToolbar = () => {
  return (
    <div className="w-full shadow-md">
      <div className="text-center text-3xl py-4 bg-surface w-full">
        <GameStatusText />
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Context, useGame } from "../game_logic/GameContext";
import { getExpectedState } from "../game_logic/state_machine";
import Loading from "./Loading";

const getTimeInfo = (context: Context): string => {
  const { state, timeToChange } = getExpectedState(context);

  let prefix = "";
  switch (state) {
    case "waiting":
      prefix = "Game starts in %s";
      break;
    case "in_progress":
      prefix = "Swap in %s";
      break;
    case "saving_work":
      prefix = "Saving your work %s";
      break;
    case "finished":
      return "Game ended";
    default:
      throw new Error("Don't know how to handle status: " + state);
  }

  const minutes = Math.floor(timeToChange! / 60000);
  const seconds = ((timeToChange! % 60000) / 1000).toFixed(0).padStart(2, "0");
  return prefix.replace("%s", `${minutes}:${seconds}`);
};

function GameStatusText() {
  const { state } = useGame();

  const [timeInfo, setTimeInfo] = useState(getTimeInfo(state.context));

  useEffect(() => {
    if (!["waiting", "in_progress", "saving_work"].includes(state.value)) {
      setTimeInfo(getTimeInfo(state.context));
      return;
    }

    const timer = setInterval(() => {
      setTimeInfo(getTimeInfo(state.context));
    }, 500);
    return () => clearInterval(timer);
  }, [state.value, state.context.meta]);

  switch (state.value) {
    case "game_not_found":
      return <p>Game not found!</p>;
    case "loading_game":
    case "loading_work":
      return <Loading />;
    case "loaded":
    case "waiting":
    case "in_progress":
    case "finished":
    case "saving_work":
      return (
        <p>
          <strong>{timeInfo}</strong>
        </p>
      );
    default:
      throw new Error("Don't know how to handle status: " + state.value);
  }
}