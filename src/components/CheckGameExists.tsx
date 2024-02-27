import { Status } from "../logic/game_logic";
import { useGame } from "../logic/GameContext";


export const CheckGameExists = ({ children }) => {
  const { status } = useGame();
  if (status === Status.DOES_NOT_EXIST) {
    return <p>Game does not exist</p>;
  }
  return children;
};
