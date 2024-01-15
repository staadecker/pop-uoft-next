import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

export const GameInProgress = () => {
  return (
    <div>
      <GameEditor />
    </div>
  );
};

const initialConfig = {
  namespace: "MyEditor",
  theme: {},
  onError: console.error,
};

const GameEditor = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
};
