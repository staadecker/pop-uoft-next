import {
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { GameUsers } from "./game";

type EditorState = {
  state: string;
  name: string;
};

export type Work = {
  [key: string]: EditorState;
};

export const saveProgress = async (
  db: Firestore,
  gameId: string,
  startingUserId: string,
  userId: string,
  work
) => {
  const data = {
    state: work,
    savedAt: new Date(),
  };

  const userRef = doc(
    db,
    "games",
    gameId,
    "users",
    startingUserId,
    "works",
    userId
  );
  try {
    await setDoc(userRef, data, { merge: true });
    console.log("User work saved + " + userId);
  } catch (error) {
    throw Error("Error saving user work: " + error);
  }
};

export const loadExistingWork = async (
  db: Firestore,
  gameId: string,
  startingUserId: string,
  users: GameUsers
): Promise<Work> => {
  const userRef = collection(
    db,
    "games",
    gameId,
    "users",
    startingUserId,
    "works"
  );

  const userSnapshot = await getDocs(userRef);
  const editor_states = Object.fromEntries(
    userSnapshot.docs
      .sort((a, b) => a.data().savedAt - b.data().savedAt)
      .map((doc) => [doc.id, {state: doc.data().state}])
  );
  for (const userId in editor_states) {
    editor_states[userId]["name"] = users[userId].displayName;
  }

  console.log("Loaded existing work: ", editor_states)

  return editor_states as Work;
};
