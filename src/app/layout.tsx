import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = { title: "Telapsy — Things worth keeping", description: "A considered modern store for everyday essentials." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers><Header /><main>{children}</main><Footer /></Providers></body></html>;
}
