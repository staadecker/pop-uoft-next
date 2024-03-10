import { createBrowserRouter } from "react-router-dom";
import CreateGame from "./routes/CreateGame";
import ManageGame from "./routes/ManageGame";
import GamePage from "./routes/GamePage";
import MessagePage from "./components/MessagePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MessagePage msg="Use a game link to use this site." />,
  },
  {
    path: "/create_game",
    element: <CreateGame />,
  },
  {
    path: "/manage_game/:gameId",
    element: <ManageGame />,
    loader: ({ params }) => ({ gameId: params.gameId }),
  },
  {
    path: "/:gameId",
    element: <GamePage />,
    loader: ({ params }) => ({ gameId: params.gameId }),
  },
]);
