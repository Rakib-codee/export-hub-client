import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createImport, fetchProductById } from "../services/api.js";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const ProductDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [qty, setQty] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [toast, setToast] = useState(null);
	const { user } = useAuth();

	const available = useMemo(() => Number(product?.availableQuantity ?? 0), [product]);
	const disableSubmit = useMemo(() => {
		const q = Number(qty);
		return !q || q < 1 || q > available || !user;
	}, [qty, available, user]);

	useEffect(() => {
		document.title = product?.name ? `Import Export Hub | ${product.name}` : "Import Export Hub | Product";
		let mounted = true;
		(async () => {
			try {
				const data = await fetchProductById(id);
				if (mounted) setProduct(data);
			} catch (e) {
				setError("Failed to load product details");
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [id]);

	const handleImport = async (e) => {
		e.preventDefault();
		if (disableSubmit) return;
		try {
			setSubmitting(true);
			const created = await createImport({
				userId: user.uid,
				productId: product._id,
				quantity: Number(qty)
			});
			// Optimistically reduce available qty on UI
			setProduct((prev) => ({ ...prev, availableQuantity: (prev.availableQuantity || 0) - created.quantity }));
			setToast({ type: "success", message: "Imported successfully" });
			(document.getElementById("import_modal_close") || {}).click?.();
		} catch (e) {
			setToast({ type: "error", message: e?.response?.data?.message || "Failed to import" });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-center">Product Details</h1>
			{loading && (
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 animate-pulse">
					<div className="w-full h-80 bg-base-200 rounded-lg" />
					<div className="space-y-3">
						<div className="h-6 bg-base-200 rounded w-2/3" />
						<div className="h-4 bg-base-200 rounded w-1/3" />
						<div className="h-4 bg-base-200 rounded w-1/2" />
						<div className="h-24 bg-base-200 rounded w-full" />
						<div className="h-10 bg-base-200 rounded w-1/2" />
					</div>
				</div>
			)}
			{error && <p className="text-center text-red-500">{error}</p>}
			{toast && (
				<div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} max-w-xl mx-auto mb-4`}>
					<span>{toast.message}</span>
					<button className="btn btn-sm btn-ghost ml-auto" onClick={() => setToast(null)}>×</button>
				</div>
			)}
			{!loading && product && (
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<img
							src={product.img || product.image}
							alt={product.name}
							className="w-full h-80 object-cover rounded-lg"
						/>
					</motion.div>
					<div className="md:sticky md:top-20 self-start">
						<h2 className="text-2xl font-bold">{product.name}</h2>
						<p className="text-gray-600 mt-2">Origin: {product.originCountry || product.country}</p>
						<p className="mt-2"><span className="font-semibold">Price:</span> ${product.price}</p>
						<p className="mt-2"><span className="font-semibold">Available Quantity:</span> {product.availableQuantity ?? "-"}</p>
						<p className="mt-4 text-sm text-gray-700">{product.description}</p>
						<div className="mt-6 flex gap-3">
							<button className="btn btn-primary" onClick={() => document.getElementById("import_modal").showModal()}>
								Import Now
							</button>
							<a href="/all-products" className="btn btn-outline">Back to Products</a>
						</div>
					</div>
				</div>
			)}

			{/* Import Modal */}
			<dialog id="import_modal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg mb-2">Import Product</h3>
					<p className="text-sm text-gray-600 mb-4">Available: {available}</p>
					<form onSubmit={handleImport} className="space-y-4">
						<input
							type="number"
							min={1}
							max={available}
							className="input input-bordered w-full"
							value={qty}
							onChange={(e) => setQty(e.target.value)}
							required
						/>
						<button className="btn btn-primary w-full" disabled={disableSubmit || submitting}>
							{submitting ? "Importing..." : "Submit"}
						</button>
					</form>
					<div className="modal-action">
						<form method="dialog">
							<button id="import_modal_close" className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
};

export default ProductDetails;


