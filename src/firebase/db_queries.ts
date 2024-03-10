import {
  Firestore,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { avatar_colors, avatars } from "../components/UserCard";
import { Context } from "../game_logic/GameContext";
import { GameMetaData, GameUser } from "./db_schema";

export const addUserToDb = async (context: Context) => {
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  const color = avatar_colors[Math.floor(Math.random() * avatar_colors.length)];
  const userRef = doc(
    context.db,
    "games",
    context.gameId,
    "users",
    context.currentUserUid
  );

  await setDoc(userRef, { displayName: avatar, displayColor: color, works: [] });
  console.log("User added to game + " + context.currentUserUid);
};

export const getGameMetadata = async (
  context: Context,
  callback: (meta: null | GameMetaData) => void
) => {
  const ref = doc(context.db, "games", context.gameId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    callback(null);
  } else {
    callback(snapshot.data() as GameMetaData);
  }
};

export const loadAndListenForUsers = (
  context: Context,
  onNewUser: (newUserId: string, newUserData: GameUser) => void
) => {
  const ref = collection(context.db, "games", context.gameId, "users");
  console.log("Listening for users");
  const unsubscribe = onSnapshot(
    ref,
    (querySnapshot: QuerySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          onNewUser(change.doc.id, change.doc.data() as GameUser);
        } else {
          console.warn("Unhandled change: " + change.type);
        }
      });
    },
    (error) => {
      console.error(error);
    }
  );
  return unsubscribe;
};

export type Works = {
  userId: string;
  state?: string;
}[];

export const savePriorWorks = async (
  context: Context,
  startingUserId: string,
  works: Works
) => {
  const ref = doc(context.db, "games", context.gameId, "users", startingUserId);

  try {
    await setDoc(
      ref,
      { works: works, lastUpdatedAt: new Date() },
      { merge: true }
    );
    console.log("Work saved for starting user " + startingUserId);
  } catch (error) {
    throw Error("Error saving user work: " + error);
  }
};

export const loadPriorWorks = async (
  context: Context,
  startingUserId: string,
  callback: (works: Works) => void
) => {
  const userRef = doc(
    context.db,
    "games",
    context.gameId,
    "users",
    startingUserId
  );

  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw Error("User not found: " + startingUserId);
  }

  let works = userSnapshot.data().works as Works;

  if (works === undefined) {
    works = [];
  }

  if (!(context.currentUserUid in works.map((work) => work.userId))) {
    works.push({ userId: context.currentUserUid });
  }

  callback(works);
};

export const createGame = async (
  db: Firestore,
  waitTime: number,
  popInterval: number,
  numberOfPops: number,
  question: string
) => {
  const gameId = getRandomGameId(3);
  const ref = doc(db, "games", gameId);

  await setDoc(ref, {
    startTime: new Date(Date.now() + 1000 * waitTime),
    popInterval,
    numberOfPops,
    question,
  });
  return gameId;
};

const getRandomGameId = (length: number) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
