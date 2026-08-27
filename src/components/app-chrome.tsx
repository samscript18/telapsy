"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionShell } from "@/components/motion-shell";

const appPrefixes = ["/dashboard", "/profile", "/settings", "/orders", "/notifications", "/cart", "/checkout"];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inApp = appPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return <>{!inApp && <Header />}<MotionShell><main className={inApp ? "" : "pt-24 pb-16 md:pt-28"}>{children}</main></MotionShell>{!inApp && <Footer />}</>;
}
