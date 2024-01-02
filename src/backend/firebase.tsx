// Inspired from https://github.com/wobsoriano/solid-firebase
import { FirebaseApp } from "firebase/app";
import { User, browserLocalPersistence, getAuth, isSignInWithEmailLink, setPersistence, signInWithEmailLink } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createContext, useContext, Component, JSX, createResource } from "solid-js";

const FirebaseContext = createContext<FirebaseApp>();

interface Props {
    app: FirebaseApp
    children: JSX.Element
}

export const FirebaseAppProvider: Component<Props> = (props) => {
    return (
        <FirebaseContext.Provider value={props.app}>
            {props.children}
        </FirebaseContext.Provider>
    );
}

export function useFirebaseApp() {
    const app = useContext(FirebaseContext);
    if (!app) {
        throw new Error(
            'useFirebaseApp must be used within a <FirebaseContext.Provider />',
        )
    }
    return app;
}


export async function useFirebaseAuth() {
    const app = useFirebaseApp();
    const auth = getAuth(app);

    try {
        // Make sure we persist the user's auth state
        await setPersistence(auth, browserLocalPersistence)
    } catch (error) {
        console.error(error);
    }

    if (auth.currentUser) {
        console.log(`Already signed in as ${auth.currentUser.email}!`);
        return auth;
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
        console.log("Signing in with email link...")
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('emailForSignIn');
        console.log(email);
        if (!email) {
            const searchParams = new URLSearchParams(window.location.search);
            email = searchParams.get("email");
            if (!email) {
                console.error("No email provided");
                return auth;
            }
            const confirmed = confirm("You are joining the game as " + email + ". Is this correct?");
            if (!confirmed) {
                console.error("User cancelled");
                return auth;
            }
        }

        // The client SDK will parse the code from the link for you.
        try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            if (auth.currentUser) {
                console.log(`Signed in as ${(auth.currentUser as User).email}!`);
                return auth;
            }
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
        } catch (error) {
            // TODO
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
            console.error(error);
        }
    }

    console.log("Not signed in.");

    return auth;
}

export const createAuthResource = ()  => {
    return createResource(useFirebaseAuth);
}

export const useDatabase = () => {
    const app = useFirebaseApp();
    const db = getFirestore(app);
    return db;
}