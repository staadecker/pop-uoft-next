import { useRef, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import Editor from "../components/lexical/Editor";
import { EditorContext, getEditorState } from "../game_logic/EditorContext";
import { InputAdornment, TextField } from "@material-ui/core";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useFirebase } from "../firebase/FirebaseContext";
import { createGame } from "../firebase/db_queries";

const CreateGame = () => {
  const { db } = useFirebase();
  const navigate = useNavigate();
  const [editor] = useLexicalComposerContext();
  const [submitting, setSubmitting] = useState(false);
  const submitButton = useRef<HTMLButtonElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    // This is necessary since some of the Editor events bubble up and will trigger the form submission :/
    e.preventDefault();
    if (submitButton.current !== (e.nativeEvent as SubmitEvent).submitter) return;
    
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
    <div className="w-full flex flex-col items-center p-5">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col space-y-8 max-w-screen-xl items-left">
          
          <div>
            <h1 className="text-lg">Question for students</h1>
            <Editor placeholderText="Enter your question..." fileIO />
          </div>

          <div className="flex flex-row space-x-8">
            <TextField
              label="Number of rounds"
              name="numberOfPops"
              defaultValue={3}
              type="number"
            />
            <TextField
              label="Duration of rounds"
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

          <LoadingButton
            loading={submitting}
            type="submit"
            color="primary"
            variant="contained"
            ref={submitButton}
          >
            Start Game
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default () => (
  <EditorContext>
    <CreateGame />
  </EditorContext>
);
