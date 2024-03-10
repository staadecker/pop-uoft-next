import { createContext, useContext, useState } from "react";
import { GameMetaData, GameUser } from "../firebase/db_schema";
import { Firestore } from "firebase/firestore";
import { LexicalEditor } from "lexical";
import { PossibleState, useGameStateMachine } from "./state_machine";
import { Works } from "../firebase/db_queries";

type EditorsProvider = {
  editors: { [key: string]: LexicalEditor };
  setEditors: (fn: (editors: { [key: string]: LexicalEditor }) => void) => void;
};

const GameDataContext = createContext<EditorsProvider | null>(null);
const GameStateMachine = createContext<{
  send: Function;
  state: { value: PossibleState; context: Context };
} | null>(null);

export type Context = {
  gameId: string;
  currentUserUid: string;
  db: Firestore;
  users: { [key: string]: GameUser };
  meta?: GameMetaData;
  priorWorks: Works;
};

const GameStateMachineProvider = ({
  children,
  gameId,
  isPlayer,
}: {
  children: JSX.Element;
  gameId: string;
  isPlayer: boolean;
}) => {
  const [state, send] = useGameStateMachine(gameId, isPlayer);

  return (
    <GameStateMachine.Provider value={{ state, send }}>
      {children}
    </GameStateMachine.Provider>
  );
};

export const useGameData = () => {
  const context = useContext(GameDataContext);
  if (context === null) {
    throw new Error("useGameData must be used within a GameDataContext");
  }
  return context;
};

export const useGame = () => {
  const context = useContext(GameStateMachine);
  if (context === null) {
    throw new Error("useGame must be used within a GameStateMachine");
  }
  return context;
};

export const GameContextProvider = ({
  children,
  gameId,
  isPlayer,
}: {
  children: JSX.Element;
  gameId: string;
  isPlayer: boolean;
}) => {
  const [editors, setEditors] = useState({});

  return (
    <GameDataContext.Provider value={{ editors, setEditors }}>
      <GameStateMachineProvider gameId={gameId} isPlayer={isPlayer}>
        {children}
      </GameStateMachineProvider>
    </GameDataContext.Provider>
  );
};
