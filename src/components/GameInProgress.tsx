import {
  ContentEditable,
  HistoryPlugin,
  LexicalComposer,
  LexicalErrorBoundary,
  RichTextPlugin,
} from "lexical-solid";
import { GameContentProps } from "../pages/[game_id]";

export const GameInProgress = (props: GameContentProps) => {
  return (
    <div>
      <GameEditor {...props} />
    </div>
  );
};

const initialConfig = {
  namespace: "MyEditor",
  theme: {},
  onError: console.error,
};

const GameEditor = (props: GameContentProps) => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        errorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      {process.env.NODE_ENV === "development" && <TreeViewPlugin />}
    </LexicalComposer>
  );
};
