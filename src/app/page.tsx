"use client";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Game from "../components/game_route/page";
import { useEffect, useState } from "react";
import { Router } from "@remix-run/router";

export default function About() {
  const [router, setRouter] = useState<Router | undefined>(undefined);
  useEffect(() => {
    setRouter(
      createBrowserRouter([
        {
          path: "/",
          element: <p>Hi there!</p>,
        },
        {
          path: "/:gameId",
          element: <Game />,
        },
      ])
    );
  }, []);
  return router ? <RouterProvider router={router} /> : <p>Loading...</p>;
}
