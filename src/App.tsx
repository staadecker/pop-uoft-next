import '@material/web/button/filled-button.js'
import '@material/web/textfield/outlined-text-field.js'
import { useFirebaseApp } from './firebase';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { Show, createSignal } from 'solid-js';

const suffix = "@mail.utoronto.ca"


declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": any,
      "md-outlined-text-field": any
    }
  }
}




function App() {
  const [success, setSuccess] = createSignal(false);
  let email: any;
  const app = useFirebaseApp();
  const auth = getAuth(app);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://pop-uoft.firebaseapp.com/',
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email.value + suffix, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      console.log(`Email sent to ${email.value+suffix}`)
      window.localStorage.setItem('emailForSignIn', email);
      setSuccess(true);
    } catch (error: any) {
      // TODO handle error
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  }

  return (

    <div class="grid place-items-center h-screen w-screen bg-background">
      <form onSubmit={onSubmit}>
        <div class="flex flex-col space-y-4 bg-surface p-8 text-left rounded-md drop-shadow place-content-center">
          <Show when={!success()} fallback={
            <div class="flex flex-col space-y-4">
              <p class="text-2xl font-bold">Check your email!</p>
              <p class="text-lg">We've sent you a link to sign in.</p>
              <p class="text-lg">If you don't see it, check your spam folder.</p>
            </div>

          }>
            <md-outlined-text-field label="U of T Email" ref={email} required suffix-text={suffix} pattern="[\\w\\d_.\\-]+" />
            <div class="flex flex-row justify-end">
              <md-filled-button onClick="submit">Get email link</md-filled-button>
            </div>
          </Show>

        </div >
      </form>
    </div>


  )
}

export default App
