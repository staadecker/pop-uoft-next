import { Context } from "./GameContext";

export const after = (ms: number, fn: () => void): (() => void) => {
  const timeout = setTimeout(fn, ms + 1);
  return () => clearTimeout(timeout);
};

export type EffectArgs = {
  send: Function;
  setContext: (fn: (context: Context) => void) => { send: Function };
  event: any;
  context: Context;
};
