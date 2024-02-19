import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import GamePage from "./routes/GamePage";
import { FirebaseAppProvider } from "./backend/firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Follow a game link to use this site.</p>,
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
