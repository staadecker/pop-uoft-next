import { useEffect, useState } from "react";
import { useGame } from "../logic/GameContext";
import { Status, getNextEventTime } from "../logic/game_logic";
import WaitGameLoad from "./WaitGameLoad";

function GameStatusUnwrapper() {
  const { meta, status } = useGame();

  const [timeInfo, setTimeInfo] = useState(getNextEventTime(meta));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getNextEventTime(meta));
    }, 500);

    return () => clearInterval(timer);
  });

  switch (status) {
    case Status.UNKNOWN:
      return <p>Loading...</p>;
    case Status.WAITING:
      return <p>Game starts in <strong>{timeInfo.timeRemaining}</strong></p>
    case Status.IN_PROGRESS:
      return <p>Swap in <strong>{timeInfo.timeRemaining}</strong></p>
    case Status.FINISHED:
      return <p>Game ended</p>
    default:
      throw new Error("Don't know how to handle status: " + status);
  }
}

const GameStatus = () => {
  return (
    <WaitGameLoad>
      <div className="text-center text-3xl">
      <GameStatusUnwrapper />
      </div>
    </WaitGameLoad>
  );
}

export default GameStatus;
