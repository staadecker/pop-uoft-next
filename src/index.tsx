import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { FirebaseProvider } from "./logic/FirebaseContext";
import { router } from "./router";

const USE_STRICT_MODE = true;

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(
  USE_STRICT_MODE ? (
    <StrictMode>
      <FirebaseProvider>
        <RouterProvider router={router} />
      </FirebaseProvider>
    </StrictMode>
  ) : (
    <FirebaseProvider>
      <RouterProvider router={router} />
    </FirebaseProvider>
  )
);
