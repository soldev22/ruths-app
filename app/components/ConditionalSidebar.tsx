"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  
  // Show sidebar only on protected routes or authenticated pages
  const showSidebar = pathname?.startsWith("/protected") || 
                      pathname === "/" || 
                      pathname === "/user-guide" ||
                      pathname === "/about" ||
                      pathname === "/faq" ||
                      pathname === "/scoring-guide" ||
                      pathname === "/privacy" ||
                      pathname === "/contact" ||
                      pathname?.startsWith("/screening");
  
  if (!showSidebar) {
    return null;
  }
  
  return <Sidebar />;
}
