import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, User, getAuth, signInAnonymously } from "firebase/auth";
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
    apiKey: "AIzaSyCnIpYjoP9LBwfEyEcMQgq4gd0vaa6BstA",
    authDomain: "pop-uoft.firebaseapp.com",
    projectId: "pop-uoft",
    storageBucket: "pop-uoft.appspot.com",
    messagingSenderId: "448097432689",
    appId: "1:448097432689:web:1a82ae4b88d2f2e28a97d0",
  });
  const auth = getAuth(app);
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
