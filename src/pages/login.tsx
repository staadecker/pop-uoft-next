import { sendSignInLinkToEmail } from "firebase/auth";
import { Show, createSignal } from "solid-js";
import { createAuthResource } from "../backend/firebase";

const suffix = "@mail.utoronto.ca"

declare module "solid-js" {
    namespace JSX {
      interface IntrinsicElements {
        "md-filled-button": any,
        "md-outlined-text-field": any
      }
    }
  }

export const Login = () => {
    const [authResource] = createAuthResource();
    const [success, setSuccess] = createSignal(false);
    let email: any;


    const onSubmit = async (e: any) => {
        e.preventDefault();

        const auth = authResource(); 
        if (!auth) {
            throw Error("Auth is not ready, this should never happen!")
        }
        
        const fullEmail = email.value + suffix;

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: import.meta.env.PROD ? 'https://pop-uoft.firebaseapp.com/' : "http://localhost:5174/" + "?email=" + fullEmail,
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, fullEmail, actionCodeSettings);
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            console.log(`Email sent to ${fullEmail}`)
            window.localStorage.setItem('emailForSignIn', fullEmail);
            setSuccess(true);
        } catch (error: any) {
            // TODO handle error
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    return <div class="grid place-items-center h-screen w-screen bg-background">
        <Show when={authResource.state == "ready"} fallback={<p>Loading...</p>}>
            <form onSubmit={onSubmit}>
                <div class="flex flex-col space-y-4 bg-surface p-8 text-left rounded-md drop-shadow place-content-center">
                    <Show when={!success()} fallback={
                        <div class="flex flex-col space-y-4">
                            <p class="text-2xl font-bold">Check your email!</p>
                            <p class="text-lg">We've sent you a link to join the game.</p>
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
        </Show>
    </div>

}