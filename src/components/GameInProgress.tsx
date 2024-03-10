import "./index.css";

import Editor from "./lexical/Editor";

import { EditorContext, RegisterEditor } from "../game_logic/EditorContext";
import { useGame } from "../game_logic/GameContext";
import { GameToolbar } from "./GameToolbar";
import { UserCard } from "./UserCard";
import { Works } from "../firebase/db_queries";

export const PROFS_KEY = "__prof";

export function GameWrapper() {
  const { state } = useGame();

  const works: Works = (
    [{ userId: PROFS_KEY, state: state.context.meta!.question }] as Works
  ).concat(state.context.priorWorks);

  return (
    <div className="flex flex-col items-center">
      <GameToolbar />
      <div className="px-10 py-4 max-w-screen-xl">
        {works.map(({ userId, state: editorState }) => {
          return (
            <div key={userId}>
              <EditorLabel userId={userId} />
              <EditorContext>
                <RegisterEditor id={userId}>
                  <Editor
                    startingState={editorState}
                    editable={userId == state.context.currentUserUid}
                    comments={userId !== PROFS_KEY}
                    placeholderText="Enter your answer..."
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

const EditorLabel = ({ userId }: { userId: string }) => {
  if (userId === PROFS_KEY) return <h1>Question for students:</h1>;

  return <UserCard userId={userId} />;
};
