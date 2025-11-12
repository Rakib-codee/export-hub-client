import ProductCard from "../components/ProductCard.jsx";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fetchAllProducts } from "../services/api.js";

const AllProducts = () => {
	const [items, setItems] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(12);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const totalPages = useMemo(() => (limit ? Math.ceil(total / limit) : 1), [total, limit]);

	useEffect(() => {
		document.title = "Import Export Hub | All Products";
		let active = true;
		(async () => {
			try {
				setLoading(true);
				const res = await fetchAllProducts({ page, limit, search: search.trim() });
				if (!active) return;
				setItems(res.items || []);
				setTotal(res.total || 0);
			} catch (e) {
				if (active) setError("Failed to fetch products");
			} finally {
				if (active) setLoading(false);
			}
		})();
		return () => {
			active = false;
		};
	}, [page, limit, search]);

	return (
		<div className="min-h-screen">
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-3xl font-bold mb-6 text-center"
			>
				All Products
			</motion.h1>

			<div className="flex items-center gap-3 mb-6">
				<input
					className="input input-bordered w-full"
					placeholder="Search by product name or origin country"
					value={search}
					onChange={(e) => {
						setPage(1);
						setSearch(e.target.value);
					}}
				/>
			</div>

			{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="card bg-base-100 border animate-pulse">
							<div className="w-full aspect-[4/3] bg-base-200" />
							<div className="p-4 space-y-3">
								<div className="h-4 bg-base-200 rounded w-2/3" />
								<div className="h-3 bg-base-200 rounded w-1/2" />
								<div className="h-8 bg-base-200 rounded w-full" />
							</div>
						</div>
					))}
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{items.map((p) => (
							<ProductCard key={p._id} product={p} />
						))}
					</div>
					{totalPages > 1 && (
						<div className="flex justify-center mt-8 gap-2">
							<button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
								Prev
							</button>
							<div className="px-3 py-2 text-sm">Page {page} of {totalPages}</div>
							<button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AllProducts;


