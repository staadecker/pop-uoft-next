import { useRef, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import Editor from "../components/lexical/Editor";
import { EditorContext, getEditorState } from "../game_logic/EditorContext";
import { InputAdornment, TextField } from "@material-ui/core";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useFirebase } from "../firebase/FirebaseContext";
import { createGame } from "../firebase/db_queries";
import { Card } from "@mui/material";

const CreateGame = () => {
  const { db } = useFirebase();
  const navigate = useNavigate();
  const [editor] = useLexicalComposerContext();
  const [submitting, setSubmitting] = useState(false);
  const submitButton = useRef<HTMLButtonElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    // This is necessary since some of the Editor events bubble up and will trigger the form submission :/
    e.preventDefault();
    if (submitButton.current !== (e.nativeEvent as SubmitEvent).submitter)
      return;

    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);

    const gameId = await createGame(
      db,
      Number(formData.get("waitingTime")),
      Number(formData.get("popInterval")),
      Number(formData.get("numberOfPops")),
      getEditorState(editor)
    );

    navigate("/manage_game/" + gameId);
  };

  return (
    <div className="w-full h-full flex flex-col items-center py-8 px-4">
      <form onSubmit={onSubmit}>
        <Card className="flex flex-col space-y-8 max-w-screen-xl items-stretch p-8 bg-surface">
          <div className="space-y-2">
            <h1 className="text-lg">Game question</h1>
            <Editor placeholderText="Enter your question..." fileIO />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg">Game settings</h1>
            <div className="flex flex-row space-x-8">
              <TextField
                label="Number of rounds"
                name="numberOfPops"
                defaultValue={3}
                type="number"
              />
              <TextField
                label="Round duration"
                defaultValue={3}
                type="number"
                name="popInterval"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">min</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Time to join game"
                defaultValue={120}
                type="number"
                name="waitingTime"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">sec</InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <LoadingButton
              className="grow flex rounded-2xl max-w-xl justify-center items-center gap-3 bg-primarycontainer"
              loading={submitting}
              type="submit"
              variant="contained"
              ref={submitButton}
            >
              <div className="text-onprimarycontainer text-lg font-bold">
                Create Game
              </div>
            </LoadingButton>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default () => (
  <EditorContext>
    <CreateGame />
  </EditorContext>
);
