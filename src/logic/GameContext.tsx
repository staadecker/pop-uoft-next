import { createContext, useContext, useEffect, useReducer } from "react";
import { useFirebase } from "./FirebaseContext";
import {
  Status,
  fetchGame,
  getNextEventTime,
  getStatus,
  loadAndListenForUsers,
} from "./game_logic";
import { gameReducer } from "./game_logic";
import { GameDispatchActionType } from "./game_logic";
import { initialGameState } from "./game_logic";
import { GameState } from "./game_logic";
import { CheckGameExists } from "../components/CheckGameExists";

export type GameDispatchAction = {
  type: GameDispatchActionType;
  payload: any;
};

const GameContext = createContext<GameState>(null);
const GameDispatchContext = createContext(null);

const GameLoader = ({ children, gameId }) => {
  const { db } = useFirebase();
  const dispatch = useGameDispatch();

  const { meta, status } = useGame();

  useEffect(() => {
    let interval;
    switch (status) {
      case Status.UNKNOWN:
        fetchGame(db, gameId, dispatch);
        loadAndListenForUsers(db, gameId, dispatch);
      case Status.WAITING:
        interval = setTimeout(() => {
          const nextState = getStatus(meta);
          dispatch({
            type: GameDispatchActionType.SET_STATUS,
            payload: nextState,
          });
        }, getNextEventTime(meta).timeDiff);
        return () => clearInterval(interval);
      case Status.IN_PROGRESS:
        interval = setTimeout(() => {
          const nextState = getStatus(meta);
          dispatch({
            type: GameDispatchActionType.SET_STATUS,
            payload: nextState,
          });
        }, getNextEventTime(meta).timeDiff);
        return () => clearInterval(interval);
    }
  }, [status]);

  return children;
};

export const useGame = () => {
  return useContext(GameContext);
};

export const useGameDispatch = () => {
  return useContext(GameDispatchContext);
};

export const GameContextProvider = (props: {
  children: JSX.Element;
  gameId: string;
}) => {
  const { gameId } = props;

  const [gameState, dispatch] = useReducer(
    gameReducer,
    initialGameState(gameId)
  );

  return (
    <GameContext.Provider value={gameState}>
      <GameDispatchContext.Provider value={dispatch}>
        <GameLoader gameId={gameId}>
          <CheckGameExists>{props.children}</CheckGameExists>
        </GameLoader>
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};


