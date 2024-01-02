
import { doc, getDoc } from "firebase/firestore";
import { useDatabase } from "./firebase";

export type GameData  = {}

export const fetchGame = async (gameId: string) : Promise<GameData | null> => {
    const db = useDatabase();
    const docRef = doc(db, "games", gameId);
    let docSnap;
    try {
        docSnap = await getDoc(docRef);
    } catch (e) {
        console.log("Error getting document: ", docRef.path);
        console.error(e);
        return null;
    }

    if (!docSnap.exists()) {
        console.log("No such game!");
        return null;
    }

    return docSnap.data();
}