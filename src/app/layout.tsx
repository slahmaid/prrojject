import "./globals.css";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/server/auth";
import { SignOutButton, SignInLink } from "@/components/auth-buttons";

export const metadata = {
	title: "MVP App — Simple Bookmark Manager",
	description: "Capture and organize links with a generous free plan.",
	metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
	openGraph: {
		title: "MVP App — Simple Bookmark Manager",
		description: "Capture and organize links with a generous free plan.",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "MVP App",
		description: "Capture and organize links with a generous free plan.",
	},
};

export default async function RootLayout({ children }: { children: ReactNode }) {
	const session = await getServerSession(authOptions as any);
	return (
		<html lang="en">
			<head>
				{process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
					<script
						defer
						data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
						src="https://plausible.io/js/script.js"
					></script>
				) : null}
			</head>
			<body>
				<nav className="border-b p-4 flex gap-4">
					<Link href="/">Home</Link>
					<Link href="/pricing">Pricing</Link>
					<Link href="/faq">FAQ</Link>
					<Link href="/legal/terms">Terms</Link>
					<Link href="/legal/privacy">Privacy</Link>
					{session ? (
						<>
							<Link href="/dashboard">Dashboard</Link>
							<SignOutButton />
						</>
					) : (
						<SignInLink />
					)}
				</nav>
				{children}
			</body>
		</html>
	);
}
