import "./index.css";

import Editor from "./lexical/Editor";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Work } from "../logic/game_logic";
import { loadExistingWork } from "../logic/game_logic";
import { saveProgress } from "../logic/game_logic";
import {
  EditorContext,
  RegisterEditor,
  getEditorState,
  setEditorState,
} from "./EditorContext";
import { useFirebase } from "../logic/FirebaseContext";
import { useGame } from "../logic/GameContext";
import { GameToolbar } from "./GameToolbar";

export function GameWrapper() {
  const { db, currentUser } = useFirebase();
  const { gameId, meta, users } = useGame();
  const [work, setWork] = useState<Work | undefined>(undefined);

  useEffect(() => {
    const fetch = async () => {
      const work = {
        _: {
          state: meta.prompt,
          name: "Professor's question",
        },
        ...(await loadExistingWork(db, gameId, currentUser.uid, users)),
      };
      if (!(currentUser.uid in work))
        work[currentUser.uid] = { state: undefined, name: "Your answer" };
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
                  <RegisterEditor id={userId}>
                    <EditorBlock
                      startingState={state}
                      editable={userId == currentUser.uid}
                    />
                  </RegisterEditor>
                </EditorContext>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function EditorBlock({
  startingState,
  editable,
}: {
  startingState: string | undefined;
  editable: boolean;
}) {
  const { db, currentUser } = useFirebase();
  const { gameId } = useGame();
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
    if (startingState) {
      setEditorState(editor, startingState);
    }
  }, [editor, startingState]);

  return (
    <>
      <Editor editable={editable} />
      {editable && <button onClick={saveGame}>Save Game</button>}
    </>
  );
}
