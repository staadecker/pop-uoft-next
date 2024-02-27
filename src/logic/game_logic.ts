import {
  Firestore,
  QuerySnapshot,
  Timestamp,
  Unsubscribe,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { avatars, avatar_colors } from "../components/UserCard";
import { LexicalEditor } from "lexical";
import { GameDispatchAction } from "./GameContext";

export const initialGameState = (gameId): GameState => ({
  users: {},
  meta: undefined,
  gameId,
  status: Status.UNKNOWN,
  editors: {},
});

export type GameState = {
  users: GameUsers;
  meta?: GameMetaData | null;
  gameId: string;
  status: Status;
  editors: {
    [key: string]: LexicalEditor;
  };
  unsubscribeToUsers?: () => void;
};

export type GameUsers = {
  [key: string]: GameUser;
};
export type GameUser = {
  displayName: string;
  displayColor: string;
};

export type GameMetaData = {
  startTime: Timestamp;
  numberOfPops: number;
  popInterval: number;
  prompt: string;
};
export enum Status {
  UNKNOWN = "unknown",
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  SAVING = "saving",
  FINISHED = "finished",
  SET_STATUS = "set_status",
  DOES_NOT_EXIST = "does_not_exist",
}

export enum GameDispatchActionType {
  SET_STATUS = "set_status",
  SET_USERS = "set_users",
  SET_META = "set_meta",
  SAVE_PROGRESS = "save_progress",
  SET_PROGRESS = "set_progress",
  START_GAME = "start_game",
  ADD_USER = "add_user",
  ADD_EDITOR = "add_editor",
  REMOVE_EDITOR = "remove_editor",
  ADD_LISTENER = "add_listener",
  REMOVE_LISTENER = "remove_listener",
}

export const gameReducer = (
  gameState: GameState,
  action: GameDispatchAction
) => {
  console.log("gameReducer", gameState, action);
  switch (action.type) {
    case GameDispatchActionType.SET_USERS:
      return { ...gameState, users: action.payload };
    case GameDispatchActionType.SET_META:
      return { ...gameState, meta: action.payload };
    case GameDispatchActionType.ADD_USER:
      return { ...gameState, users: { ...gameState.users, ...action.payload } };
    case GameDispatchActionType.SET_STATUS:
      return { ...gameState, status: action.payload };
    case GameDispatchActionType.ADD_EDITOR:
      return {
        ...gameState,
        editors: { ...gameState.editors, ...action.payload },
      };
    case GameDispatchActionType.REMOVE_EDITOR:
      const { [action.payload]: _, ...editors } = gameState.editors;
      return { ...gameState, editors };
    case GameDispatchActionType.ADD_LISTENER:
      return { ...gameState, removeListener: action.payload };
    case GameDispatchActionType.REMOVE_LISTENER:
      gameState.unsubscribeToUsers();
      return { ...gameState, removeListener: undefined };
    default:
      throw new Error("Unknown action: " + action.type);
  }
};

export const addUserToDb = async (
  db: Firestore,
  gameId: string,
  userId: string
) => {
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  const color = avatar_colors[Math.floor(Math.random() * avatar_colors.length)];
  const userRef = doc(db, "games", gameId, "users", userId);

  await setDoc(userRef, { displayName: avatar, displayColor: color });
  console.log("User added to game + " + userId);
};

export const fetchGame = async (db, gameId, dispatch) => {
  const ref = doc(db, "games", gameId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    dispatch({
      type: GameDispatchActionType.SET_STATUS,
      payload: Status.DOES_NOT_EXIST,
    });
    return;
  }

  const meta = snapshot.data() as GameMetaData;

  dispatch({
    type: GameDispatchActionType.SET_META,
    payload: meta,
  });

  dispatch({
    type: GameDispatchActionType.SET_STATUS,
    payload: getStatus(meta),
  });
};

export const loadAndListenForUsers = (db, gameId, dispatch) => {
  const ref = collection(db, "games", gameId, "users");
  console.log("Listening for users");
  const unsubscribe = onSnapshot(
    ref,
    (querySnapshot: QuerySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          dispatch({
            type: GameDispatchActionType.ADD_USER,
            payload: {
              [change.doc.id]: change.doc.data() as GameUser,
            },
          });
        } else {
          console.warn("Unhandled change: " + change.type);
        }
      });
    },
    (error) => {
      console.error(error);
    }
  );



  dispatch({
    type: GameDispatchActionType.ADD_LISTENER,
    payload: () => {
      console.log("Removing listener")
      unsubscribe();
    },
  })
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
      .map((doc) => [doc.id, { state: doc.data().state }])
  );
  for (const userId in editor_states) {
    editor_states[userId]["name"] = users[userId].displayName;
  }

  console.log("Loaded existing work: ", editor_states);

  return editor_states as Work;
};

export const getNextEventTime = (meta: GameMetaData) => {
  const currentTime = new Date().getTime();
  let popNumber = 0;
  let gameStarted = false;
  let gameEnded = false;
  let timeRemaining = undefined;
  let timeDiff = undefined;
  let nextEventTime = meta.startTime.toDate().getTime();

  if (currentTime >= nextEventTime) {
    gameStarted = true;
    for (; popNumber < meta.numberOfPops; popNumber++) {
      nextEventTime += meta.popInterval * 60 * 1000;
      if (currentTime < nextEventTime) {
        break;
      }
    }
    if (popNumber === meta.numberOfPops) {
      gameEnded = true;
    }
  }

  if (!gameEnded) {
    timeDiff = nextEventTime - currentTime;
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = ((timeDiff % 60000) / 1000).toFixed(0).padStart(2, "0");
    timeRemaining = `${minutes}:${seconds}`;
  }

  return { timeRemaining, gameStarted, popNumber, gameEnded, timeDiff };
};

export const getStatus = (meta: GameMetaData) => {
  const nextEvent = getNextEventTime(meta);
  return nextEvent.gameEnded
    ? Status.FINISHED
    : nextEvent.gameStarted
    ? Status.IN_PROGRESS
    : Status.WAITING;
};

export type EditorState = {
  state: string;
  name: string;
};
export type Work = {
  [key: string]: EditorState;
};
