import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MotionShell } from "@/components/motion-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "Telapsy — Luxury Essentials & Modern Objects",
  description: "A considered storefront for everyday luxury, precision electronics, and technical apparel.",
  openGraph: {
    title: "Telapsy — Objects with gravity.",
    description: "Forty considered pieces across fashion, electronics, home, and accessories.",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "Telapsy — Objects with gravity." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telapsy — Objects with gravity.",
    description: "Forty considered pieces across fashion, electronics, home, and accessories.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--canvas)] font-sans text-[var(--ink)] antialiased">
        <Providers>
          <Header />
          <MotionShell>
            <main className="pt-24 pb-16 md:pt-28">{children}</main>
          </MotionShell>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
