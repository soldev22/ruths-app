import type { ReactNode } from "react";
import Header from "./components/Header";  // your client-side header
import ConditionalSidebar from "./components/ConditionalSidebar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: 0 }}>
        <Header />   {/* CORRECT header */}
        
        <div className="layout" style={{ display: "flex", flex: 1 }}>
          <ConditionalSidebar />

          <main className="main-content" style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column" }}>
            {children}
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}
