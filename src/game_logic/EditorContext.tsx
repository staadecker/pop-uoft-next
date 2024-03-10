import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SettingsContext } from "../components/lexical/context/SettingsContext";
import PlaygroundNodes from "../components/lexical/nodes/PlaygroundNodes";
import { SharedHistoryContext } from "../components/lexical/context/SharedHistoryContext";
import { TableContext } from "../components/lexical/plugins/TablePlugin";
import { SharedAutocompleteContext } from "../components/lexical/context/SharedAutocompleteContext";
import PlaygroundEditorTheme from "../components/lexical/themes/PlaygroundEditorTheme";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { LexicalEditor } from "lexical";
import { useGameData } from "./GameContext";

export function EditorContext({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const initialConfig = {
    editorState: undefined,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>{children}</SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}

export function RegisterEditor({
  id,
  children,
}: {
  id: string;
  children: JSX.Element;
}) {
  const [editor] = useLexicalComposerContext();
  const { setEditors } = useGameData();

  useEffect(() => {
    setEditors((editors) => ({ ...editors, [id]: editor }));
  }, [id, setEditors]);

  return children;
}

export function getEditorState(editor: LexicalEditor): string {
  return JSON.stringify(editor.getEditorState().toJSON());
}

export function setEditorState(editor: LexicalEditor, state: string) {
  editor.setEditorState(editor.parseEditorState(JSON.parse(state)));
}
