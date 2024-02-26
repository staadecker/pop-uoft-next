import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "../backend/game";

type Status = {
  timeRemaining?: string;
  gameStarted: boolean;
  popNumber?: number;
  gameEnded: boolean;
};

export function GameStatus() {
  const { meta } = useContext(GameContext);
  const { numberOfPops, popInterval } = meta!;

  const getStatus = () => {
    const currentTime = new Date().getTime();
    let popNumber = 0;
    let gameStarted = false;
    let gameEnded = false;
    let timeRemaining = undefined;
    let nextEventTime = meta!.startTime.toDate().getTime();
    if (currentTime >= nextEventTime) {
      gameStarted = true;
      for (; popNumber < numberOfPops; popNumber++) {
        nextEventTime += popInterval * 60 * 1000;
        if (currentTime < nextEventTime) {
          break;
        }
      }
      if (popNumber === numberOfPops) {
        gameEnded = true;
      }
    }
    if (!gameEnded) {
        const timeDiff = nextEventTime - currentTime;
        const minutes = Math.floor(timeDiff / 60000);
        const seconds = ((timeDiff % 60000) / 1000).toFixed(0).padStart(2, "0");
        timeRemaining = `${minutes}:${seconds}`;
    }
    return { timeRemaining, gameStarted, popNumber, gameEnded };
  };

  const [status, setStatus] = useState<Status>(getStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getStatus());
    }, 500);

    return () => clearInterval(timer);
  });

  return (
    <div className="text-center text-3xl">
      {status.gameEnded ? (
        <>Game ended</>
      ) : status.gameStarted ? (
        <>
          Swap in <strong>{status.timeRemaining}</strong>
        </>
      ) : (
        <p>
          Game starts in <strong>{status.timeRemaining}</strong>
        </p>
      )}
    </div>
  );
}
