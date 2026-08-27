import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { AppChrome } from "@/components/app-chrome";
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
					<AppChrome>{children}</AppChrome>
				</Providers>
			</body>
		</html>
	);
}
