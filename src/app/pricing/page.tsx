"use client";

import { useState } from "react";

export default function PricingPage() {
	const [loading, setLoading] = useState<string | null>(null);

	async function upgrade() {
		setLoading("upgrade");
		const res = await fetch("/api/billing/checkout", { method: "POST" });
		setLoading(null);
		if (!res.ok) return;
		const { url } = await res.json();
		if (url) window.location.href = url;
	}

	async function portal() {
		setLoading("portal");
		const res = await fetch("/api/billing/portal", { method: "POST" });
		setLoading(null);
		if (!res.ok) return;
		const { url } = await res.json();
		if (url) window.location.href = url;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-semibold mb-6">Pricing</h1>
			<div className="grid md:grid-cols-3 gap-4">
				<div className="border p-4 rounded">
					<h2 className="text-xl font-medium">Free</h2>
					<p className="text-3xl font-bold my-2">$0</p>
					<ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
						<li>3 bookmarks per month</li>
						<li>Basic features</li>
					</ul>
				</div>
				<div className="border p-4 rounded">
					<h2 className="text-xl font-medium">Pro</h2>
					<p className="text-3xl font-bold my-2">$9/mo</p>
					<ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
						<li>1000 bookmarks/month</li>
						<li>Priority support</li>
					</ul>
					<button onClick={upgrade} className="mt-3 w-full bg-black text-white py-2 rounded" disabled={loading === "upgrade"}>
						{loading === "upgrade" ? "Redirecting..." : "Upgrade"}
					</button>
				</div>
				<div className="border p-4 rounded">
					<h2 className="text-xl font-medium">Business</h2>
					<p className="text-3xl font-bold my-2">$49/mo</p>
					<ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
						<li>10,000 bookmarks/month</li>
						<li>Advanced features</li>
					</ul>
					<button onClick={portal} className="mt-3 w-full border py-2 rounded" disabled={loading === "portal"}>
						{loading === "portal" ? "Opening..." : "Manage subscription"}
					</button>
				</div>
			</div>
		</div>
	);
}
