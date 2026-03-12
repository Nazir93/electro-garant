"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "./header";

export function ConditionalNavBar() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <NavBar />;
}
