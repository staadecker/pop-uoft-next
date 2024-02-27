import { createBrowserRouter } from "react-router-dom";
import CreateGame from "./routes/CreateGame";
import ManageGame from "./routes/ManageGame";
import GamePage from "./routes/GamePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Follow a game link to use this site.</p>,
  },
  {
    path: "/create_game",
    element: <CreateGame />,
  },
  {
    path: "/manage_game/:gameId",
    element: <ManageGame />,
    loader: async ({ params }) => {
      const gameId = params.gameId;
      return { gameId };
    },
  },
  {
    path: "/:gameId",
    element: <GamePage />,
    loader: async ({ params }) => {
      const gameId = params.gameId;
      return { gameId };
    },
  },
]);
