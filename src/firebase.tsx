// Inspired from https://github.com/wobsoriano/solid-firebase
import { FirebaseApp } from "firebase/app";
import { createContext, useContext, Component, JSX } from "solid-js";

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
