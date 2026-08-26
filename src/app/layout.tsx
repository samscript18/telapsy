import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telapsy — Luxury Essentials & Modern Objects",
  description: "A considered storefront for everyday luxury, precision electronics, and technical apparel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--canvas)] font-sans text-[var(--ink)] antialiased">
        <Providers>
          <Header />
          <main className="pt-24 md:pt-28 pb-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
