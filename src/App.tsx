import '@material/web/button/filled-button.js'
import '@material/web/textfield/outlined-text-field.js'
import { Route, Router, Navigate, Params } from '@solidjs/router';
import { AboutPage } from './pages/about';
import { Game } from './pages/[game_id]';
import { fetchGame } from './backend/fetchGame';
import { createResource } from 'solid-js';

const loadGame = ({ params }: { params: Params }) => {
  const [game] = createResource(() => params.game_id, fetchGame)
  return game;
}

function App() {
  return (
    <Router>
      <Route path="/" component={() => <Navigate href={(_) => "/about"} />} />
      <Route path="/about" component={AboutPage} />
      <Route path=":game_id" load={loadGame} component={Game}/>
    </Router>
  )
}

export default App
