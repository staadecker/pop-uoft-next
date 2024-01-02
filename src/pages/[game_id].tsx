import { Resource, Show, Suspense } from "solid-js"
import { Login } from "./login";
import { createAuthResource } from "../backend/firebase";
import { RouteSectionProps } from "@solidjs/router";
import { GameData } from "../backend/fetchGame";



export const Game = (props: RouteSectionProps) => {
    const routeData = props.data as Resource<GameData | null>;
    const [auth] = createAuthResource();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Show when={routeData()} fallback={<p>No such game found</p>} keyed>
                {(routeDataNonNull) => {
                    return <Show when={auth()?.currentUser} fallback={<Login />} >
                        <p>{routeDataNonNull.toString()}</p>
                    </Show>
                }}
            </Show>
        </Suspense>
    )
}