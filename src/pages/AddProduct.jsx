import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const AddProduct = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    originCountry: "",
    rating: "",
    availableQuantity: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating || 0),
      availableQuantity: Number(form.availableQuantity || 0),
      exporterUserId: user?.uid,
    };

    try {
      const API = import.meta.env.VITE_API_BASE_URL || "https://export-hub-server.vercel.app";
      const response = await fetch(`${API}/models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add product");

      setToast({ type: "success", message: "Product added successfully!" });

      setForm({
        name: "",
        image: "",
        price: "",
        originCountry: "",
        rating: "",
        availableQuantity: "",
        description: "",
      });
    } catch (error) {
      setToast({ type: "error", message: error.message || "Add failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-linear-to-br from-slate-100 via-white to-slate-50">
      {(() => { document.title = "Import Export Hub | Add Product"; return null; })()}

      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} mb-6 max-w-md w-full shadow-lg`}>
          <span>{toast.message}</span>
          <button className="btn btn-sm btn-ghost ml-auto" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/60 shadow-lg border border-gray-100 rounded-2xl p-8 flex flex-col gap-4 w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
          Add Product
        </h1>

        <input className="input input-bordered w-full" name="image" placeholder="Product Image URL" value={form.image} onChange={handleChange} required />
        <input className="input input-bordered w-full" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />

        <div className="grid grid-cols-2 gap-3">
          <input className="input input-bordered w-full" name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input className="input input-bordered w-full" name="originCountry" placeholder="Origin Country" value={form.originCountry} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="input input-bordered w-full" name="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating (0-5)" value={form.rating} onChange={handleChange} />
          <input className="input input-bordered w-full" name="availableQuantity" type="number" min="0" placeholder="Available Quantity" value={form.availableQuantity} onChange={handleChange} required />
        </div>

        <textarea className="textarea textarea-bordered w-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button className="btn w-full text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all" disabled={submitting}>
          {submitting ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;