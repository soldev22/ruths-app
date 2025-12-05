"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  label: string;
};

export default function SidebarLink({ href, label }: Props) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-md mb-1 
                 transition-all
                 text-sm font-medium
                 hover:bg-[#e6e6e6] 
                 hover:pl-5
                 whitespace-nowrap
                 cursor-pointer
                 "
      style={{
        background: active ? "#dce7ff" : "transparent",
        borderLeft: active ? "4px solid #1a73e8" : "4px solid transparent",
      }}
    >
      {label}
    </Link>
  );
}
