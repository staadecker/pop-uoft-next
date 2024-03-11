import { Timestamp } from "firebase/firestore";

export type GameMetaData = {
    startTime: Timestamp;
    numRounds: number;
    roundDuration: number;
    question: string;
};

export type GameUsers = {
  [key: string]: GameUser;
};
export type GameUser = {
  displayName: string;
  displayColor: string;
};