import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import GamePage from "./routes/GamePage";
import { FirebaseAppProvider } from "./backend/firebase";
import CreateGame from "./routes/CreateGame";
import ManageGame from "./routes/ManageGame";

const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Follow a game link to use this site.</p>,
  },
  {
    path: "/create_game",
    element: <CreateGame/>,
  },
  {
    path: "/manage_game/:gameId",
    element: <ManageGame/>,
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

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <FirebaseAppProvider>
      <RouterProvider router={router} />
    </FirebaseAppProvider>
  </StrictMode>
);
