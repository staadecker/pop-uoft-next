import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SettingsContext } from "./lexical/context/SettingsContext";
import PlaygroundNodes from "./lexical/nodes/PlaygroundNodes";
import { SharedHistoryContext } from "./lexical/context/SharedHistoryContext";
import { TableContext } from "./lexical/plugins/TablePlugin";
import { SharedAutocompleteContext } from "./lexical/context/SharedAutocompleteContext";
import PlaygroundEditorTheme from "./lexical/themes/PlaygroundEditorTheme";

export function EditorContext({ children }): JSX.Element {
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
            <SharedAutocompleteContext>
              <div className="editor-shell-no">{children}</div>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}

export function getEditorState(editor): string {
  return JSON.stringify(editor.getEditorState().toJSON());
}

export function setEditorState(editor, state: string) {
  editor.setEditorState(editor.parseEditorState(JSON.parse(state)));
}
