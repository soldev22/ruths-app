import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Ruth's Screening Tool",
  description: "A tool for teachers to screen students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Header />
        <main className="pt-6 px-4">{children}</main>
      </body>
    </html>
  );
}
