import "./index.css";

import Editor from "./lexical/Editor";
import { GameContext } from "../backend/game";
import { useContext, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FirebaseContext } from "../backend/firebase";
import { Work, loadExistingWork, saveProgress } from "../backend/game_work";
import { EditorContext, getEditorState, setEditorState } from "./editor";
import { GameStatus } from "./GameStatus";

export function GameWrapper() {
  const { db, currentUser } = useContext(FirebaseContext);
  const { gameId, meta, users } = useContext(GameContext);
  const [work, setWork] = useState<Work | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      const work = {
        "_": {
          state: meta.prompt,
          name: "Professor's question"
        },
        ...(await loadExistingWork(db, gameId, currentUser.uid, users))
      }
      if (!(currentUser.uid in work))
        work[currentUser.uid] = { state: undefined, name: "Your answer"};
      setWork(work);
    };
    fetch();
  }, [db, currentUser, gameId, users]);

  return (
    <div className="flex flex-col items-center">
      <GameToolbar />
      <div className="px-10 py-4 max-w-screen-xl">
        {work &&
          Object.entries(work).map(([userId, { state, name }]) => {
            return (
              <div key={userId}>
                <h1>{name}</h1>
                <EditorContext>
                  <EditorBlock
                    startingState={state}
                    editable={userId == currentUser.uid}
                  />
                </EditorContext>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const GameToolbar = () => {
  return <div className="bg-slate-100 w-full h-10">
    <GameStatus/>
  </div>;
};

function EditorBlock({
  startingState,
  editable,
}: {
  startingState: string | undefined;
  editable: boolean;
}) {
  const { db, currentUser } = useContext(FirebaseContext);
  const { gameId } = useContext(GameContext);
  const [editor] = useLexicalComposerContext();

  const saveGame = () => {
    saveProgress(
      db,
      gameId,
      currentUser.uid,
      currentUser.uid,
      getEditorState(editor)
    );
  };

  useEffect(() => {
    editor.setEditable(editable);
    if (!startingState) return;
    setEditorState(editor, startingState);
  }, [editor, startingState]);

  return (
    <>
      <Editor editable={editable} />
      {editable && <button onClick={saveGame}>Save Game</button>}
    </>
  );
}
