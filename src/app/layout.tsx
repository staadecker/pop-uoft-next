'use client'

import "./globals.css";
import { Inter } from "next/font/google";
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";
import { FirebaseAppProvider } from "@/backend/firebase";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAppProvider>
          {children}
        </FirebaseAppProvider>
      </body>
    </html>
  );
}
