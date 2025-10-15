export default function FAQPage() {
	return (
		<div className="mx-auto max-w-3xl p-6 space-y-6">
			<h1 className="text-3xl font-semibold">FAQ</h1>
			<div>
				<h2 className="font-medium">What is this?</h2>
				<p className="text-sm text-gray-600">A minimal bookmark manager MVP with subscriptions.</p>
			</div>
			<div>
				<h2 className="font-medium">How does the free plan work?</h2>
				<p className="text-sm text-gray-600">You can create up to 3 bookmarks per month for free.</p>
			</div>
			<div>
				<h2 className="font-medium">Can I cancel anytime?</h2>
				<p className="text-sm text-gray-600">Yes. Manage your subscription from the portal.</p>
			</div>
		</div>
	);
}
