import '@material/web/button/filled-button.js'
import '@material/web/textfield/outlined-text-field.js'

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
  let email: any;

  const onSubmit = (e: any) => {
    e.preventDefault()
    // const full_email = email.value + suffix;

  }

  return (
    <div class="grid place-items-center h-screen w-screen bg-background">
      <form onSubmit={onSubmit}>
        <div class="flex flex-col space-y-4 bg-surface p-8 text-left rounded-md drop-shadow place-content-center">
          <md-outlined-text-field label="U of T Email" value="" ref={email} required suffix-text={suffix} pattern="[\\w\\d_.\\-]+" />
          <div class="flex flex-row justify-end">
            <md-filled-button onClick="submit">Get email link</md-filled-button>
          </div>
        </div >
      </form>
    </div>
  )
}

export default App
