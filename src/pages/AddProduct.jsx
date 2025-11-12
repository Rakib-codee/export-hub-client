import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { createProduct } from "../services/api.js";

const AddProduct = () => {
	const [form, setForm] = useState({
		name: "",
		image: "",
		price: "",
		originCountry: "",
		rating: "",
		availableQuantity: "",
		description: ""
	});
	const [submitting, setSubmitting] = useState(false);
	const [toast, setToast] = useState(null);
	const { user } = useAuth();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setSubmitting(true);
			const payload = {
				...form,
				price: Number(form.price),
				rating: Number(form.rating || 0),
				availableQuantity: Number(form.availableQuantity || 0),
				exporterUserId: user?.uid
			};
			await createProduct(payload);
			setToast({ type: "success", message: "Product added" });
			setForm({ name: "", image: "", price: "", originCountry: "", rating: "", availableQuantity: "", description: "" });
		} catch (e2) {
			setToast({ type: "error", message: e2?.response?.data?.message || "Failed to add product" });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex justify-center">
			<div className="w-full max-w-xl mt-8">
				{(() => { document.title = "Import Export Hub | Add Export"; return null; })()}
				{toast && (
					<div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} mb-4`}>
						<span>{toast.message}</span>
						<button className="btn btn-sm btn-ghost ml-auto" onClick={() => setToast(null)}>×</button>
					</div>
				)}
				<form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow flex flex-col gap-4">
					<h1 className="text-2xl font-bold text-center">Add Product</h1>
					<input className="input input-bordered w-full" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
					<input className="input input-bordered w-full" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input className="input input-bordered w-full" name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />
						<input className="input input-bordered w-full" name="originCountry" placeholder="Origin Country" value={form.originCountry} onChange={handleChange} required />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input className="input input-bordered w-full" name="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating (0-5)" value={form.rating} onChange={handleChange} />
						<input className="input input-bordered w-full" name="availableQuantity" type="number" min="0" placeholder="Available Quantity" value={form.availableQuantity} onChange={handleChange} required />
					</div>
					<textarea className="textarea textarea-bordered w-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
					<button className="btn btn-primary w-full" disabled={submitting}>{submitting ? "Saving..." : "Add Export/Product"}</button>
				</form>
			</div>
		</div>
	);
};

export default AddProduct;


