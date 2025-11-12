import { useEffect, useState } from "react";
import { deleteImport, fetchMyImports } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const MyImports = () => {
	const { user } = useAuth();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [toast, setToast] = useState(null);

	useEffect(() => {
		document.title = "Import Export Hub | My Imports";
		let active = true;
		(async () => {
			if (!user) return;
			setLoading(true);
			try {
				const res = await fetchMyImports(user.uid);
				if (!active) return;
				setItems(res);
			} catch (e) {
				if (active) setToast({ type: "error", message: "Failed to load imports" });
			} finally {
				if (active) setLoading(false);
			}
		})();
		return () => { active = false; };
	}, [user]);

	const removeImport = async (id) => {
		try {
			await deleteImport(id);
			setItems((prev) => prev.filter((x) => x._id !== id));
			setToast({ type: "success", message: "Removed from imports" });
		} catch {
			setToast({ type: "error", message: "Failed to remove" });
		}
	};

	return (
		<div className="min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-center">My Imports</h1>
			{toast && (
				<div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} max-w-xl mx-auto mb-4`}>
					<span>{toast.message}</span>
					<button className="btn btn-sm btn-ghost ml-auto" onClick={() => setToast(null)}>×</button>
				</div>
			)}
			{loading ? (
				<p className="text-center text-gray-600">Loading...</p>
			) : items.length === 0 ? (
				<p className="text-center text-gray-600">You have no imports yet.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{items.map((it) => (
						<div key={it._id} className="border rounded-lg p-4 bg-base-100">
							<div className="flex gap-4">
								<img src={it.productSnapshot?.image} alt={it.productSnapshot?.name} className="w-24 h-24 object-cover rounded"/>
								<div className="flex-1">
									<div className="font-semibold">{it.productSnapshot?.name}</div>
									<div className="text-sm text-gray-600">Origin: {it.productSnapshot?.originCountry}</div>
									<div className="text-sm">Price: ${it.productSnapshot?.price}</div>
									<div className="text-sm">Imported Qty: {it.quantity}</div>
									<div className="mt-2 flex gap-2">
										<Link to={`/product/${it.productId}`} className="btn btn-sm btn-outline">See Details</Link>
										<button className="btn btn-sm btn-error" onClick={() => removeImport(it._id)}>Remove</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MyImports;


