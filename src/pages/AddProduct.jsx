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
    description: "",
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
        exporterUserId: user?.uid,
      };
      await createProduct(payload);
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
    } catch (e2) {
      setToast({
        type: "error",
        message: e2?.response?.data?.message || "Failed to add product",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 bg-linear-to-br from-slate-100 via-white to-slate-50">
      {(() => {
        document.title = "Import Export Hub | Add Export";
        return null;
      })()}

      {toast && (
        <div
          className={`alert ${
            toast.type === "success" ? "alert-success" : "alert-error"
          } mb-6 max-w-md w-full shadow-lg`}
        >
          <span>{toast.message}</span>
          <button
            className="btn btn-sm btn-ghost ml-auto"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* --- Form Section --- */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/60 shadow-lg border border-gray-100 rounded-2xl p-8 flex flex-col gap-4"
        >
          <h1 className="text-3xl font-bold text-center mb-4 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add Product
          </h1>

          <input
            className="input input-bordered w-full"
            name="image"
            placeholder="Product Image URL"
            value={form.image}
            onChange={handleChange}
            required
          />
          <input
            className="input input-bordered w-full"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="input input-bordered w-full"
              name="price"
              type="number"
              min="0"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
            <input
              className="input input-bordered w-full"
              name="originCountry"
              placeholder="Origin Country"
              value={form.originCountry}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="input input-bordered w-full"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="Rating (0–5)"
              value={form.rating}
              onChange={handleChange}
            />
            <input
              className="input input-bordered w-full"
              name="availableQuantity"
              type="number"
              min="0"
              placeholder="Available Quantity"
              value={form.availableQuantity}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            className="textarea textarea-bordered w-full min-h-[100px]"
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleChange}
          />

          <button
            className="btn w-full text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add Product"}
          </button>
        </form>

        {/* --- Live Preview Card --- */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg p-6 flex flex-col items-center justify-center border border-gray-100">
          {form.image ? (
            <img
              src={form.image}
              alt={form.name}
              className="w-56 h-56 object-cover rounded-xl shadow-md"
            />
          ) : (
            <div className="w-56 h-56 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="text-center mt-4 space-y-1">
            <h2 className="text-xl font-semibold">{form.name || "Product Name"}</h2>
            <p className="text-gray-600">{form.originCountry || "Origin Country"}</p>
            <p className="text-gray-800 font-medium">
              ${form.price || "0.00"} | ⭐ {form.rating || "0.0"}
            </p>
            <p className="text-sm text-gray-500">
              Qty: {form.availableQuantity || 0}
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn btn-sm bg-red-500 text-white hover:bg-red-600">
              Delete
            </button>
            <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
