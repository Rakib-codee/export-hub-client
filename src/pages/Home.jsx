import { motion } from "framer-motion";
import HeroSlider from "../components/HeroSlider.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";
import { fetchLatestProducts } from "../services/api.js";

const demoProducts = [
	{ id: 1, name: "Arabica Coffee Beans", price: 420, country: "Brazil", img: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop", rating: 4.5, availableQuantity: 1200 },
	{ id: 2, name: "Premium Basmati Rice", price: 560, country: "India", img: "https://images.unsplash.com/photo-1615486363871-5a1f8a2a8733?q=80&w=1200&auto=format&fit=crop", rating: 4.2, availableQuantity: 800 },
	{ id: 3, name: "Organic Cocoa", price: 690, country: "Ghana", img: "https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?q=80&w=1200&auto=format&fit=crop", rating: 4.7, availableQuantity: 500 }
];

const Home = () => {
	const [latest, setLatest] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		document.title = "Import Export Hub | Home";
		let mounted = true;
		(async () => {
			try {
				const data = await fetchLatestProducts(6);
				if (mounted) setLatest(Array.isArray(data) ? data : data?.items || data?.products || []);
			} catch (e) {
				setError("Failed to load latest products");
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	return (
		<div className="min-h-screen space-y-12">
			<section className="px-4 md:px-6">
				<HeroSlider />
			</section>

			{/* Stats strip */}
			<section className="px-4 md:px-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-base-100 rounded-xl p-6 ">
					<div className="text-center">
						<div className="text-2xl font-bold">150+</div>
						<div className="text-xs text-gray-600 mt-1">Countries Served</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold">10,000+</div>
						<div className="text-xs text-gray-600 mt-1">Shipments Delivered</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold">24/7</div>
						<div className="text-xs text-gray-600 mt-1">Customer Support</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold">99.8%</div>
						<div className="text-xs text-gray-600 mt-1">On‑Time Delivery</div>
					</div>
				</div>
			</section>

			{/* Services */}
			<section className="px-4 md:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center"
				>
					<h2 className="heading-xl">Our Services</h2>
					<p className="mt-3 paragraph">Comprehensive logistics solutions tailored to your business needs.</p>
				</motion.div>
				<div className="mt-8 grid grid-cols-1  md:grid-cols-4 gap-6">
					<div className="rounded-xl p-6  bg-sky-200 card-eq">
						<div className="font-semibold">Sea Freight</div>
						<p className="text-sm text-gray-600 mt-2">Cost‑effective ocean shipping solutions for large volumes.</p>
						<a className="link mt-3 inline-block">Get Quote →</a>
					</div>
					<div className="rounded-xl p-6  bg-sky-200 card-eq">
						<div className="font-semibold">Air Freight</div>
						<p className="text-sm text-gray-600 mt-2">Fast and reliable for time‑sensitive shipments.</p>
						<a className="link mt-3 inline-block">Get Quote →</a>
					</div>
					<div className="rounded-xl p-6  bg-sky-200 card-eq">
						<div className="font-semibold">Land Transport</div>
						<p className="text-sm text-gray-600 mt-2">Efficient domestic and cross‑border transport.</p>
						<a className="link mt-3 inline-block">Get Quote →</a>
					</div>
					<div className="rounded-xl p-6  bg-sky-200 card-eq">
						<div className="font-semibold">Customs Brokerage</div>
						<p className="text-sm text-gray-600 mt-2">Expert clearance to ensure smooth border crossing.</p>
						<a className="link mt-3 inline-block">Get Quote →</a>
					</div>
				</div>
			</section>

			<section className="px-4 md:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center"
				>
					<h2 className="heading-xl">Latest Products</h2>
					<p className="mt-3 paragraph">Freshly added items from verified exporters.</p>
				</motion.div>

				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
					{(loading ? demoProducts : latest.slice(0, 6)).map((p, idx) => (
						<ProductCard key={p._id || p.id || idx} product={p} />
					))}
				</div>
				{error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}
			</section>

			<section className="px-4 md:px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
					<div className="rounded-xl p-6 border bg-base-100">
						<h3 className="font-semibold text-lg">Trusted Partners</h3>
						<p className="text-sm text-gray-600 mt-2">We verify exporters and buyers to ensure safe trade.</p>
					</div>
					<div className="rounded-xl p-6 border bg-base-100">
						<h3 className="font-semibold text-lg">Fast Logistics</h3>
						<p className="text-sm text-gray-600 mt-2">Integrated shipping support for door-to-door delivery.</p>
					</div>
					<div className="rounded-xl p-6 border bg-base-100">
						<h3 className="font-semibold text-lg">Secure Payments</h3>
						<p className="text-sm text-gray-600 mt-2">Escrow and LC guidance for international transactions.</p>
					</div>
				</div>
			</section>

			{/* Logos row */}
			<section className="px-4 md:px-6">
				<div className="text-center">
					<h3 className="heading-lg">Trusted by Leading Companies</h3>
				</div>
				<div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
					{["Maersk","MSC","CMA CGM","Hapag‑Lloyd","DHL","FedEx"].map((logo) => (
						<div key={logo} className="border rounded-lg py-3 text-center text-sm text-gray-600 bg-base-100">{logo}</div>
					))}
				</div>
			</section>

			{/* Testimonials */}
			<section className="px-4 md:px-6">
				<div className="text-center">
					<h3 className="heading-lg">What Our Clients Say</h3>
				</div>
				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="border rounded-xl p-6 bg-base-100">
						<p className="text-sm text-gray-700">“GlobalTrade has been instrumental in streamlining our export operations. Their expertise and reliability are unmatched.”</p>
						<div className="mt-4 text-xs text-gray-500">Rajesh Kumar · Kumar Exports Pvt. Ltd.</div>
					</div>
					<div className="border rounded-xl p-6 bg-base-100">
						<p className="text-sm text-gray-700">“Excellent service and competitive rates. They handle all logistics needs professionally and efficiently.”</p>
						<div className="mt-4 text-xs text-gray-500">Sarah Chen · Pacific Trade Solutions</div>
					</div>
				</div>
			</section>

			<section className="px-4 md:px-6">
				<div className="rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8 md:p-12 text-center">
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-2xl md:text-3xl font-bold"
					>
						Ready to Ship with Confidence?
					</motion.h3>
					<p className="mt-3 max-w-2xl mx-auto opacity-90">Get a personalized quote for your cargo in minutes.</p>
					<div className="mt-6 flex justify-center gap-3">
						<a href="/add-product" className="btn">Request a Quote</a>
						<a href="/all-products" className="btn btn-outline">View Services</a>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
