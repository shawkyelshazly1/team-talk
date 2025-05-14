import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"],
	variable: "--font-roboto",
});

export const metadata: Metadata = {
	title: "Team Talk",
	description: "Team communication platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${roboto.variable}`}>
			<body className="font-roboto antialiased">{children}</body>
		</html>
	);
}
