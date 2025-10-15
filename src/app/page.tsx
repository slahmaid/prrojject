import Link from "next/link";

export default function HomePage() {
	return (
		<main className="mx-auto max-w-4xl p-6">
			<section className="py-16 text-center">
				<h1 className="text-4xl font-bold tracking-tight">Save and organize links effortlessly</h1>
				<p className="mt-3 text-lg text-gray-600">A simple bookmark manager with generous free tier and affordable upgrades.</p>
				<div className="mt-6 flex justify-center gap-3">
					<Link href="/sign-in" className="bg-black text-white px-5 py-2 rounded">Get started</Link>
					<Link href="/pricing" className="border px-5 py-2 rounded">See pricing</Link>
				</div>
			</section>
			<section className="grid md:grid-cols-3 gap-4">
				<div className="border p-4 rounded">
					<h3 className="font-semibold">Quick capture</h3>
					<p className="text-sm text-gray-600">Add bookmarks with one click and keep notes.</p>
				</div>
				<div className="border p-4 rounded">
					<h3 className="font-semibold">Stay within limits</h3>
					<p className="text-sm text-gray-600">Free plan includes 3 bookmarks/month. Upgrade anytime.</p>
				</div>
				<div className="border p-4 rounded">
					<h3 className="font-semibold">Own your data</h3>
					<p className="text-sm text-gray-600">We never sell data. Export coming soon.</p>
				</div>
			</section>
			<section className="mt-12">
				<h2 className="text-2xl font-semibold mb-3">What users say</h2>
				<div className="border p-4 rounded text-sm text-gray-600">Testimonials coming soon.</div>
			</section>
		</main>
	);
}
