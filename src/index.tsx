import "./index.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { FirebaseProvider } from "./firebase/FirebaseContext";
import { router } from "./router";
import Footer from "./components/Footer";
import MessagePage from "./components/MessagePage";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <FirebaseProvider>
        <div className="flex flex-col w-screen h-screen">
          <div className="grow">
            <ErrorBoundary
              FallbackComponent={() => (
                <MessagePage msg="Oops. Something went wrong." error />
              )}
            >
              <RouterProvider router={router} />
            </ErrorBoundary>
          </div>
          <Footer />
        </div>
      </FirebaseProvider>
    </ThemeProvider>
  </StrictMode>
);
