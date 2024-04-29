import '@material/web/button/filled-button.js'
import '@material/web/textfield/outlined-text-field.js'
import { Route, Router, Navigate } from '@solidjs/router';
import { AboutPage } from './pages/about';
import { Game } from './pages/[game_id]';

function App() {
  return (
    <Router>
      <Route path="/" component={() => <Navigate href={(_) => "/about"} />} />
      <Route path="/about" component={AboutPage} />
      <Route path=":game_id" component={Game}/>
    </Router>
  )
}

export default App
