import { Auth, sendSignInLinkToEmail } from "firebase/auth";
import { Show, createSignal } from "solid-js";
import { createAuthResource } from "../backend/firebase";

const SUFFIX = "@mail.utoronto.ca";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": any;
      "md-outlined-text-field": any;
    }
  }
}

export const Login = () => {
  const [authResource] = createAuthResource();
  const [success, setSuccess] = createSignal(false);
  
  let email: any;

  const onSubmit = (auth: Auth) => async (e: any) => {
    e.preventDefault();

    const fullEmail = email.value + SUFFIX;

    const prefix = import.meta.env.PROD ? "https" : "http";

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

  return (
    <div class="grid place-items-center h-screen w-screen bg-background">
      <Show when={authResource()} fallback={<p>Loading...</p>} keyed>
        {(auth) => (
          <form onSubmit={onSubmit(auth)}>
            <div class="flex flex-col space-y-4 bg-surface p-8 text-left rounded-md drop-shadow place-content-center">
              <Show
                when={!success()}
                fallback={
                  <div class="flex flex-col space-y-4">
                    <p class="text-2xl font-bold">Check your email!</p>
                    <p class="text-lg">
                      We've sent you a link to join the game.
                    </p>
                    <p class="text-lg">
                      If you don't see it, check your spam folder.
                    </p>
                  </div>
                }
              >
                <md-outlined-text-field
                  label="U of T Email"
                  ref={email}
                  suffix-text={SUFFIX}
                  pattern="[\\w\\d_.\\-]+"
                  required
                />
                <div class="flex flex-row justify-end">
                  <md-filled-button onClick="submit">
                    Get email link
                  </md-filled-button>
                </div>
              </Show>
            </div>
          </form>
        )}
      </Show>
    </div>
  );
};
