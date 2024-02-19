import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, User, getAuth, signInAnonymously } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import React from "react";

export type Context = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  currentUser: User | null | undefined;
};

const getFirebaseContext = () => {
  const app = initializeApp({
    apiKey: "AIzaSyCnIpYjoP9LBwfEyEcMQgq4gd0vaa6BstA",
    authDomain: "pop-uoft.firebaseapp.com",
    projectId: "pop-uoft",
    storageBucket: "pop-uoft.appspot.com",
    messagingSenderId: "448097432689",
    appId: "1:448097432689:web:1a82ae4b88d2f2e28a97d0",
  });

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
};

export const FirebaseContext = createContext<Context>({
  ...getFirebaseContext(),
  currentUser: undefined,
});

export const FirebaseAppProvider = (props: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  const context = getFirebaseContext();

  useEffect(() => {
    signInAnonymously(context.auth).then((userCredential) => {
      setCurrentUser(userCredential.user);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <FirebaseContext.Provider value={{ ...context, currentUser }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
