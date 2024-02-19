import {
  Firestore,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { FirebaseContext } from "./firebase";
import { createContext, useContext, useState } from "react";

export type GameUsers = {
  [key: string]: {
    displayName: string;
  };
};

export type GameMetaData = {
  startTime: Timestamp;
};

export type GameData = {
  users: GameUsers | null | undefined;
  meta: GameMetaData | null | undefined;
  gameId: string;
};

export const GameContext = createContext<GameData>({
  users: undefined,
  meta: undefined,
  gameId: "",
});

export const GameContextProvider = (props: {
  children: JSX.Element;
  gameId: string;
}) => {
  const [usersData, setUsersData] = useState<GameUsers | null | undefined>(
    undefined
  );
  const [metaData, setMetaData] = useState<GameMetaData | null | undefined>(
    undefined
  );

  const { db } = useContext(FirebaseContext);

  const gameRef = doc(db, "games", props.gameId);

  getDoc(gameRef)
    .then((gameSnapshot) => {
      if (!gameSnapshot.exists()) setMetaData(null);
      else setMetaData(gameSnapshot.data() as GameMetaData);
    })
    .catch((error) => {
      console.error(error);
    });

  const usersRef = collection(db, "games", props.gameId, "users");

  onSnapshot(
    usersRef,
    (querySnapshot: QuerySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        setUsersData((prev) => ({
          ...prev,
          [change.doc.id]: change.doc.data() as {
            displayName: string;
          },
        }));
      });
    },
    (error) => {
      console.error(error);
    }
  );

  return (
    <GameContext.Provider value={{ users: usersData, meta: metaData, gameId: props.gameId }}>
      {props.children}
    </GameContext.Provider>
  );
};

export const addUserToGame = async (
  db: Firestore,
  gameId: string,
  userId: string,
  displayName: string
) => {
  const userRef = doc(db, "games", gameId, "users", userId);
  try {
    await setDoc(userRef, { displayName });
    console.log("User added to game + " + userId);
  } catch (error) {
    throw Error("Error adding user to game: " + error);
  }
};
