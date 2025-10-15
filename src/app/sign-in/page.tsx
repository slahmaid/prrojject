"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const res = await signIn("credentials", {
			redirect: true,
			email,
			password,
			callbackUrl: "/dashboard",
		});
		if (res?.error) setError(res.error);
		setLoading(false);
	}

	return (
		<div className="mx-auto max-w-md p-6">
			<h1 className="text-2xl font-semibold mb-4">Sign in</h1>
			<form onSubmit={onSubmit} className="space-y-3">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full border px-3 py-2 rounded"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full border px-3 py-2 rounded"
					required
				/>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button disabled={loading} className="w-full bg-black text-white py-2 rounded">
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>
			<div className="my-4 text-center text-sm text-gray-500">or</div>
			<button
				onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
				className="w-full border py-2 rounded"
			>
				Continue with Google
			</button>
		</div>
	);
}
