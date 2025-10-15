"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function SignInLink() {
	return (
		<Link href="/sign-in" className="ml-auto border px-3 py-1 rounded">
			Sign in
		</Link>
	);
}

export function SignOutButton() {
	return (
		<button onClick={() => signOut({ callbackUrl: "/" })} className="ml-auto border px-3 py-1 rounded">
			Sign out
		</button>
	);
}
