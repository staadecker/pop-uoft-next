import { For, Show, createResource, createSignal, onCleanup } from "solid-js";
import { Login } from "./login";
import { createAuthResource, useDatabase } from "../backend/firebase";
import { useParams } from "@solidjs/router";
import { GameData, addUserToGame, fetchGame } from "../backend/fetchGame";
import { UserCard } from "../components/UserCard";
import { User } from "firebase/auth";
import { TransitionGroup } from "solid-transition-group";
import { GameInProgress } from "../components/GameInProgress";

export const Game = () => {
  const params = useParams();
  const [gameData] = createResource(fetchGame(params.game_id));
  const [auth] = createAuthResource();

  return (
    <Show when={gameData() !== undefined} fallback={<p>Loading...</p>}>
      <Show when={gameData() !== null} fallback={<p>No such game found</p>}>
        <Show when={auth()?.currentUser} fallback={<Login />} keyed>
          {(user) => (
            <GameContent
              gameData={gameData() as GameData}
              user={user}
              gameId={params.game_id}
            />
          )}
        </Show>
      </Show>
    </Show>
  );
};

export type GameContentProps = {
  gameData: GameData;
  user: User;
  gameId: string;
};

export const GameContent = (props: GameContentProps) => {
  const timeBeforeStart =
    props.gameData.meta.startTime.toDate().getTime() - new Date().getTime();

  const [gameStarted, setGameStarted] = createSignal(timeBeforeStart <= 0);

  if (timeBeforeStart > 0)
    setTimeout(() => setGameStarted(true), timeBeforeStart);

  return (
    <Show
      when={gameStarted()}
      fallback={
        <GameWaitingRoom
          gameData={props.gameData}
          user={props.user}
          gameId={props.gameId}
        />
      }
    >
      <GameInProgress
        gameData={props.gameData}
        user={props.user}
        gameId={props.gameId}
      />
    </Show>
  );
};

const GameWaitingRoom = (props: GameContentProps) => {
  const db = useDatabase();

  const getTimeRemaining = () => {
    const now = new Date();
    const startTime = props.gameData.meta.startTime.toDate();
    const timeDiff = startTime.getTime() - now.getTime();
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = ((timeDiff % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const [joined, setJoined] = createSignal(false);
  const [joining, setJoining] = createSignal(false);

  const joinGame = async () => {
    // TODO autogenerate name
    setJoining(true);
    await addUserToGame(db, props.gameId, "Bat");
    setJoined(true);
  };

  const [timeRemaining, setTimeRemaining] = createSignal(getTimeRemaining());

  const timer = setInterval(() => setTimeRemaining(getTimeRemaining()), 1000);
  onCleanup(() => clearInterval(timer));

  return (
    <div class="h-screen w-screen flex flex-col">
      <div class="grow bg-background flex justify-center px-4 py-8">
        <div class="max-w-3xl flex flex-col space-y-4">
          <div class="grow basis-0 flex flex-col bg-surface rounded-xl overflow-y-scroll border border-stone-400 text-center py-4 px-2 gap-4">
            <p>
              {Object.keys(props.gameData.users()).length} players have joined
            </p>
            <div class="grow flex flex-wrap bg-surface rounded-xl items-start content-start justify-center gap-4">
              <TransitionGroup>
                <For each={Object.keys(props.gameData.users())}>
                  {(userKey) => (
                    <UserCard
                      name={props.gameData.users()[userKey].displayName}
                    />
                  )}
                </For>
              </TransitionGroup>
            </div>
          </div>
          <Show when={!joined()}>
            <div class="flex justify-center h-14">
              <button
                class="grow flex bg-primarycontainer hover:shadow-md shadow rounded-2xl max-w-md justify-center items-center gap-3"
                onClick={joinGame}
                disabled={joining()}
              >
                <img src="/icons/play.svg" class="w-6 h-6" />
                <div class="text-onprimarycontainer text-lg font-bold">
                  Join Game
                </div>
              </button>
            </div>
          </Show>
          <Show when={joined()}>
            <div class="text-center text-3xl">
              Game starts in <strong>{timeRemaining()}</strong>
            </div>
          </Show>
        </div>
      </div>
      <div class="italic text-sm bg-slate-100 px-4 py-2 text-right">
        Signed in as {props.user.email}
      </div>
    </div>
  );
};


