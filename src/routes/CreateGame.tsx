import { useContext, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { FirebaseContext } from "../backend/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Editor from "../components/lexical/Editor";
import { EditorContext, getEditorState } from "../components/editor";
import { InputAdornment, Slider, TextField } from "@material-ui/core";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const get_random_game_id = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const GameButton = ({ loading }) => {
  return (
    <LoadingButton
      loading={loading}
      type="submit"
      color="primary"
      variant="contained"
    >
      Create Game
    </LoadingButton>
  );
};

const CreateGame = () => {
  const { db } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [editor] = useLexicalComposerContext();
  const [submitting, setSubmitting] = useState(false);

  const createGame = async (e) => {
    console.log("Creating game...");
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);

    const game_id = get_random_game_id(3);
    await setDoc(doc(db, "games", game_id), {
      startTime: new Date(
        Date.now() + 1000 * 60 * Number(formData.get("waitingTime"))
      ),
      popInterval: Number(formData.get("popInterval")),
      numberOfPops: Number(formData.get("numberOfPops")),
      prompt: getEditorState(editor),
    });
    navigate("/manage_game/" + game_id);
  };

  return (
    <div className="w-screen flex flex-col items-center p-5">
      <form onSubmit={createGame}>
        <div className="flex flex-col space-y-4 max-w-screen-lg items-left">
          <div>
            <TextField
              label="Number of pops"
              name="numberOfPops"
              defaultValue={3}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div>
            <TextField
              label="Pop interval"
              defaultValue={3}
              type="number"
              name="popInterval"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <TextField
              label="Time in waiting room"
              defaultValue={2}
              type="number"
              name="waitingTime"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <h1 className="text-lg">Question for students:</h1>
            <Editor editable />
          </div>
          <GameButton loading={submitting} />
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
