import {
  Firestore,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";

const avatars = [
  "Alligator",
  "Anteater",
  "Armadillo",
  "Auroch",
  "Axolotl",
  "Badger",
  "Bat",
  "Beaver",
  "Buffalo",
  "Camel",
  "Capybara",
  "Chameleon",
  "Cheetah",
  "Chinchilla",
  "Chipmunk",
  "Chupacabra",
  "Cormorant",
  "Coyote",
  "Crow",
  "Dingo",
  "Dinosaur",
  "Dolphin",
  "Duck",
  "Elephant",
  "Ferret",
  "Fox",
  "Frog",
  "Giraffe",
  "Gopher",
  "Grizzly",
  "Hedgehog",
  "Hippo",
  "Hyena",
  "Ibex",
  "Ifrit",
  "Iguana",
  "Jackal",
  "Kangaroo",
  "Koala",
  "Kraken",
  "Lemur",
  "Leopard",
  "Liger",
  "Llama",
  "Manatee",
  "Mink",
  "Monkey",
  "Moose",
  "Narwhal",
  "Nyan Cat",
  "Orangutan",
  "Otter",
  "Panda",
  "Penguin",
  "Platypus",
  "Pumpkin",
  "Python",
  "Quagga",
  "Rabbit",
  "Raccoon",
  "Rhino",
  "Sheep",
  "Shrew",
  "Skunk",
  "Squirrel",
  "Tiger",
  "Turtle",
  "Walrus",
  "Wolf",
  "Wolverine",
  "Wombat"
]

const avatar_colors = [
  "bg-[#3f00ff]",
  "bg-[#00FF00]",
  "bg-[#FF1300]",
  "bg-[#ff6600]",
  "bg-[#DFFF00]",
  "bg-[#ff00ff]",
  "bg-[#BF00FF]",
  "bg-[#4CBB17]",
  "bg-[#0047AB]",
  "bg-[#FF0000]",
  "bg-[#00FF7F]",
  "bg-[#FF6FFF]",
  "bg-[#6F00FF]",
  "bg-[#FFD700]",
]


import { FirebaseContext } from "./firebase";
import { createContext, useContext, useEffect, useState } from "react";

export type GameUser = {
  displayName: string;
  displayColor: string;
};

export type GameUsers = {
  [key: string]: GameUser
};

export type GameMetaData = {
  startTime: Timestamp;
  numberOfPops: number;
  popInterval: number;
  prompt: string;
};

export type GameData = {
  users: GameUsers | undefined;
  meta: GameMetaData | null | undefined;
  gameId: string;
};

export const GameContext = createContext<GameData>({
  users: {},
  meta: undefined,
  gameId: "",
});

export const GameContextProvider = (props: {
  children: JSX.Element;
  gameId: string;
  waitForLoad?: boolean;
}) => {
  const { gameId, waitForLoad } = props;
  const [usersData, setUsersData] = useState<GameUsers | undefined>(undefined);
  const [metaData, setMetaData] = useState<GameMetaData | null | undefined>(
    undefined
  );

  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    const fetchGame = async () => {
      const ref = doc(db, "games", gameId);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) setMetaData(null);
      else setMetaData(snapshot.data() as GameMetaData);
    }
    fetchGame();

    const fetchUsers = async () => {
      const ref = collection(db, "games", gameId, "users");
      const usersSnapshot = await getDocs(ref);
      setUsersData(Object.fromEntries(
        usersSnapshot.docs.map((doc) => [doc.id, doc.data() as GameUser])
      ))

      onSnapshot(
        ref,
        (querySnapshot: QuerySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type == "added") {
              setUsersData((prev) => ({
                ...prev,
                [change.doc.id]: change.doc.data() as GameUser,
              }));
            } else {
              console.warn("Unhandled change: " + change.type);
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    fetchUsers();
  }, [db, gameId]);

  if (waitForLoad && (usersData === undefined || metaData === undefined)) {
    return <p>Loading game...</p>;
  }

  return (
    <GameContext.Provider
      value={{ users: usersData, meta: metaData, gameId: gameId }}
    >
      {props.children}
    </GameContext.Provider>
  );
};

export const addUserToGame = async (
  db: Firestore,
  gameId: string,
  userId: string
) => {
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  const color = avatar_colors[Math.floor(Math.random() * avatar_colors.length)];
  const userRef = doc(db, "games", gameId, "users", userId);
  try {
    await setDoc(userRef, { displayName: avatar, displayColor: color});
    console.log("User added to game + " + userId);
  } catch (error) {
    throw Error("Error adding user to game: " + error);
  }
};


