"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientForm() {
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const res = await fetch("/api/bookmarks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ url, title, notes }),
		});
		setLoading(false);
		if (!res.ok) {
			const j = await res.json().catch(() => ({}));
			setError(j.error || "Something went wrong");
			return;
		}
		setUrl("");
		setTitle("");
		setNotes("");
		router.refresh();
	}

	return (
		<form onSubmit={onSubmit} className="border p-4 rounded space-y-2">
			<div className="flex gap-2">
				<input
					type="url"
					placeholder="https://example.com"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					className="flex-1 border px-3 py-2 rounded"
					required
				/>
				<button disabled={loading} className="bg-black text-white px-4 rounded">
					{loading ? "Adding..." : "Add"}
				</button>
			</div>
			<input
				type="text"
				placeholder="Title (optional)"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full border px-3 py-2 rounded"
			/>
			<textarea
				placeholder="Notes (optional)"
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				className="w-full border px-3 py-2 rounded"
				rows={3}
			/>
			{error && <p className="text-sm text-red-600">{error}</p>}
		</form>
	);
}
