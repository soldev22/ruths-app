import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
