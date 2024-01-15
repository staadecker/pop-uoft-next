import { Auth, sendSignInLinkToEmail } from "firebase/auth";
import { useContext, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { FirebaseContext } from "@/backend/firebase";

const SUFFIX = "@mail.utoronto.ca";

export const Login = () => {
  const {auth} = useContext(FirebaseContext);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = (auth: Auth) => async (e: any) => {
    e.preventDefault();

    const fullEmail = email + SUFFIX;

    const prefix = process.env.NODE_ENV === "development" ? "http" : "https";

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${prefix}://${window.location.host}${window.location.pathname}?email=${fullEmail}`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, fullEmail, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      console.log(`Email sent to ${fullEmail}`);
      setSuccess(true);
    } catch (error: any) {
      // TODO handle error
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  if (!auth) return <p>Loading...</p>;

  return (
    <div className="grid place-items-center h-screen w-screen bg-background">
      <form onSubmit={onSubmit(auth)}>
        <div className="flex flex-col space-y-4 bg-surface p-8 text-left rounded-md drop-shadow place-content-center">
          {success ? (
            <div className="flex flex-col space-y-4">
              <p className="text-2xl font-bold">Check your email!</p>
              <p className="text-lg">We've sent you a link to join the game.</p>
              <p className="text-lg">
                If you don't see it, check your spam folder.
              </p>
            </div>
          ) : (
            <>
              <TextField
                label="U of T Email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                }}
                InputProps={{endAdornment: <InputAdornment position="end">{SUFFIX}</InputAdornment>}}
                // TODO add validation
                // pattern="[\\w\\d_.\\-]+"
                required
              />
              <div className="flex flex-row justify-end">
                <Button variant="contained" type="submit">
                  Get email link
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
