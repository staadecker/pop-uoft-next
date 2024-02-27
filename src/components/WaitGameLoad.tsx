import { useGame } from "../logic/GameContext";
import { Status } from "../logic/game_logic";

export default function WaitGameLoad({ children }) {
  const { status } = useGame();
  if (status === Status.UNKNOWN) {
    return <p>Loading...</p>;
  }
  return children;
}
