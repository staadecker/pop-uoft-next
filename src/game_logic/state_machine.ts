import useStateMachine from "@cassiozen/usestatemachine";
import {
  getGameMetadata,
  loadAndListenForUsers,
  loadPriorWorks,
  savePriorWorks,
} from "../firebase/db_queries";
import { Context, useGameData } from "./GameContext";
import { useFirebase } from "../firebase/FirebaseContext";
import { EffectArgs, after } from "./util";
import { getEditorState } from "./EditorContext";

const SAVING_TIME = 5000;

type TargetState = "waiting" | "in_progress" | "saving_work" | "finished";
export type PossibleState =
  | "loading_game"
  | "game_not_found"
  | "loaded"
  | "waiting"
  | "enter_game"
  | "not_enough_players"
  | "already_started"
  | "loading_work"
  | "in_progress"
  | "saving_work"
  | "finished"
  | "permission_denied";

export const useGameStateMachine = (gameId: string, isPlayer: boolean) => {
  const { db, currentUser } = useFirebase();
  const { editors } = useGameData();

  const states: Record<
    PossibleState,
    { on?: Record<any, PossibleState>; effect?: Function }
  > = {
    loading_game: {
      on: {
        GAME_FOUND: "loaded",
        game_not_found: "game_not_found",
        permission_denied: "permission_denied",
      },
      effect({ send, context, setContext }: EffectArgs) {
        getGameMetadata(context, (meta) => {
          if (meta === null) send("game_not_found");
          else if (!isPlayer && meta.gameManager !== currentUser.uid)
            send("permission_denied");
          else
            setContext((context) => ({ ...context, meta })).send("GAME_FOUND");
        });
        loadAndListenForUsers(context, (userId, userData) => {
          setContext(
            (context: Context): Context => ({
              ...context,
              users: { ...context.users, [userId]: userData },
            })
          );
        });
      },
    },
    permission_denied: {},
    game_not_found: {},
    loaded: {
      on: {
        waiting: "waiting",
        enter_game: "enter_game",
        finished: "finished",
      },
      effect({ send, context }: EffectArgs) {
        const expectedState = getExpectedState(context).state;
        if (expectedState === "waiting" || expectedState === "finished")
          send(expectedState);
        else send("enter_game");
      },
    },
    waiting: {
      on: {
        enter_game: "enter_game",
      },
      effect({ send, context }: EffectArgs) {
        return after(getExpectedState(context).timeToChange!, () =>
          send("enter_game")
        );
      },
    },
    enter_game: {
      on: {
        not_enough_players: "not_enough_players",
        already_started: "already_started",
        in_progress: "loading_work",
        saving_work: "saving_work",
      },
      effect({ send, context }: EffectArgs) {
        if (context.users[context.currentUserUid] === undefined && isPlayer)
          send("already_started");

        if (Object.keys(context.users).length < context.meta!.numRounds)
          send("not_enough_players");
        const expectedState = getExpectedState(context).state;
        if (expectedState === "in_progress" || expectedState === "saving_work")
          send(expectedState);
      },
    },
    not_enough_players: {},
    loading_work: {
      on: { GAME_LOADED: "in_progress" },
      effect({ send, context, setContext }: EffectArgs) {
        // TODO get the right starting userID
        const { round: popNumber } = getExpectedState(context);
        loadPriorWorks(
          context,
          getStartingUserId(context, popNumber!),
          (priorWorks) => {
            console.log("Loading prior works: ", priorWorks);
            setContext((context) => ({ ...context, priorWorks }));
            send("GAME_LOADED");
          }
        );
      },
    },
    in_progress: {
      on: { SAVE_WORK: "saving_work" },
      effect({ send, context }: EffectArgs) {
        const round = getExpectedState(context).round;
        return after(getExpectedState(context).timeToChange!, () =>
          send({ type: "SAVE_WORK", round })
        );
      },
    },
    already_started: {},
    saving_work: {
      on: { LOAD_GAME: "loading_work", END_GAME: "finished" },
      effect({ send, context, event }: EffectArgs) {
        if (event.type === "SAVE_WORK") {
          savePriorWorks(
            context,
            getStartingUserId(context, event.round),
            context.priorWorks.map((works) => ({
              userId: works.userId,
              state: getEditorState(editors[works.userId]),
            }))
          );
        }
        return after(getExpectedState(context).timeToChange!, () => {
          const expectedState = getExpectedState(context).state;
          if (expectedState === "finished") {
            send("END_GAME");
          } else {
            send("LOAD_GAME");
          }
        });
      },
    },
    finished: {},
  };

  return useStateMachine({
    context: {
      gameId,
      currentUserUid: currentUser.uid,
      db,
      users: {},
      priorWorks: [],
    },
    initial: "loading_game",
    states: states,
  });
};

export const getStartingUserId = (context: Context, round: number): string => {
  const sorted_userIds = Object.keys(context.users).sort();
  let pos = sorted_userIds.indexOf(context.currentUserUid);
  pos += round;
  if (pos >= sorted_userIds.length) pos -= sorted_userIds.length;
  return sorted_userIds[pos];
};

export const getExpectedState = (
  context: Context
): { timeToChange?: number; state: TargetState; round?: number } => {
  const currentTime = new Date().getTime();
  const startTime = context.meta!.startTime.toDate().getTime();

  if (currentTime < startTime) {
    return { timeToChange: startTime - currentTime, state: "waiting" };
  }

  let round = 0;
  const roundDuration = context.meta!.roundDuration * 60 * 1000;
  let timeSinceEvent = currentTime - startTime;
  while (timeSinceEvent >= roundDuration) {
    round++;
    if (round == context.meta!.numRounds) {
      return { state: "finished" };
    }
    timeSinceEvent -= roundDuration;
  }

  if (timeSinceEvent < SAVING_TIME && round > 0) {
    return {
      timeToChange: SAVING_TIME - timeSinceEvent,
      state: "saving_work",
      round: round,
    };
  }

  return {
    timeToChange: roundDuration - timeSinceEvent,
    state: "in_progress",
    round: round,
  };
};
