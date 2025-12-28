import type { ReactNode } from "react";
import Header from "./components/Header";  // your client-side header
import ConditionalSidebar from "./components/ConditionalSidebar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen m-0">
        <Header />
        <div className="layout flex flex-1">
          <ConditionalSidebar />
          <main className="main-content flex-1 p-8 flex flex-col">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
