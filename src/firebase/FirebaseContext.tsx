import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  User,
  browserLocalPersistence,
  getAuth,
  initializeAuth,
  signInAnonymously,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";

type FirebaseContext = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  currentUser: User;
};

// @ts-ignore
const FirebaseContext = createContext<FirebaseContext>(null);

export const FirebaseProvider = (props: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const app = initializeApp({
    apiKey: "AIzaSyBv0iJ3X3EDJ5Im1hBmBDpQ8tKO3F3TjZo",
    authDomain: "shuffle-quiz.firebaseapp.com",
    projectId: "shuffle-quiz",
    storageBucket: "shuffle-quiz.appspot.com",
    messagingSenderId: "774018965451",
    appId: "1:774018965451:web:19c826207d24e9d0b8204e",
  });
  const auth = initializeAuth(app, { persistence: browserLocalPersistence });
  const db = getFirestore(app);

  useEffect(() => {
    signInAnonymously(auth).then((userCredential) => {
      console.log("Signed in as: ", userCredential.user.uid);
      setCurrentUser(userCredential.user);
    });
  }, []);

  if (currentUser === undefined) {
    return <Loading fullScreen />;
  }

  return (
    <FirebaseContext.Provider value={{ app, auth, db, currentUser }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContext => {
  const context = useContext(FirebaseContext);

  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }

  return context;
};
