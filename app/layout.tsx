import type { ReactNode } from "react";
import Header from "./components/Header";  // your client-side header
import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />   {/* CORRECT header */}
        
        <div className="layout" style={{ display: "flex", height: "100vh" }}>
          <Sidebar />

          <main className="main-content" style={{ flex: 1, padding: "2rem" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
