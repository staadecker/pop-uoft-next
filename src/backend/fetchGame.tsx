import {
  DocumentSnapshot,
  Firestore,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useDatabase } from "./firebase";
import { Accessor, createSignal } from "solid-js";

export type GameUsers = {
  [key: string]: {
    displayName: string;
  };
};

export type GameMetaData = {
  startTime: Timestamp;
};

export type GameData = {
  users: Accessor<GameUsers>;
  meta: GameMetaData;
};

export const fetchGame =
  (gameId: string) => async (): Promise<GameData | null> => {
    const db = useDatabase();

    const gameRef = doc(db, "games", gameId);
    const gameSnapshot = await getDoc(gameRef);
    if (!gameSnapshot.exists()) {
      return null;
    }

    const usersRef = collection(db, "games", gameId, "users");

    const [usersData, setUsersData] = createSignal<GameUsers>({});

    // TODO remove this
    setTimeout(() => {
      setUsersData((prev) => ({ ...prev, test: { displayName: "Beaver" } }));
    }, 2000);

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

    return { users: usersData, meta: gameSnapshot.data() as GameMetaData };
  };

export const addUserToGame = async (db: Firestore, gameId: string, displayName: string) => {
  const userRef = collection(db, "games", gameId, "users");
  try {
    await addDoc(userRef, { displayName });
  } catch (error) {
    console.error(error);
  }
};
