import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  User,
  browserLocalPersistence,
  getAuth,
  isSignInWithEmailLink,
  setPersistence,
  signInWithEmailLink,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

export type Context = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  currentUser: User | null | undefined;
};

const getFirebaseContext = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCnIpYjoP9LBwfEyEcMQgq4gd0vaa6BstA",
    authDomain: "pop-uoft.firebaseapp.com",
    projectId: "pop-uoft",
    storageBucket: "pop-uoft.appspot.com",
    messagingSenderId: "448097432689",
    appId: "1:448097432689:web:1a82ae4b88d2f2e28a97d0",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return {
    app: app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
};

export const FirebaseContext = createContext<Context>({...getFirebaseContext(), currentUser: undefined});

export const FirebaseAppProvider = (props: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const context = getFirebaseContext();

  useEffect(() => {
    getLoggedInUser(context.auth)
      .then((currentUser) => setCurrentUser(currentUser))
      .catch(console.error);
  }, [context]);

  return (
    <FirebaseContext.Provider value={{...context, currentUser: currentUser }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export async function getLoggedInUser(auth: Auth): Promise<User | null> {
  // Make sure we persist the user's auth state
  await setPersistence(auth, browserLocalPersistence);

  if (auth.currentUser) {
    console.log(`Already signed in as ${auth.currentUser.email}!`);
    return auth.currentUser;
  }

  if (isSignInWithEmailLink(auth, window.location.href)) {
    console.log("Signing in with email link...");
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    if (!email) {
      console.error("No email provided");
      return null;
    }

    // The client SDK will parse the code from the link for you.
    await signInWithEmailLink(auth, email, window.location.href);
    if (auth.currentUser) {
      console.log(`Signed in as ${(auth.currentUser as User).email}!`);
      history.replaceState(null, "", window.location.href.split("?")[0]); // Remove the login info from the URL
      return auth.currentUser;
    }
  }

  console.log("Not signed in.");
  return null;
}