import { GameContextProvider, useGame } from "../game_logic/GameContext";
import { GameWrapper as GameInProgress } from "../components/GameInProgress";
import { GameWaitingRoom } from "../components/WaitingRoom";
import { useLoaderData } from "react-router-dom";
import Loading from "../components/Loading";
import MessagePage from "../components/MessagePage";

export default function GameContextWrapper() {
  const { gameId } = useLoaderData() as { gameId: string };
  return (
    <GameContextProvider gameId={gameId} isPlayer={true}>
      <GameRouter />
    </GameContextProvider>
  );
}

const GameRouter = () => {
  const { state } = useGame();

  switch (state.value) {
    case "loading_game":
    case "loaded":
    case "loading_work":
      return <Loading fullScreen/>;
    case "game_not_found":
      return <MessagePage msg="Oops. This link doesn't exist!" error />;
    case "waiting":
      return <GameWaitingRoom />;
    case "in_progress":
    case "saving_work":
      return <GameInProgress />;
    case "finished":
      return <MessagePage msg="Thank you for playing &#127881;" />;
    case "already_started":
      return <MessagePage msg="Game already started &#128550;" />;
    default:
      return <MessagePage msg={"Oops. The state " + state.value + " is unexpected."} error />;
  }
};
