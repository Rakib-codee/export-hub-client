import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProduct } from "../services/api.js";

const UpdateProduct = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    originCountry: "",
    rating: "",
    availableQuantity: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "Import Export Hub | Update Product";
    
    const loadProduct = async () => {
      try {
        if (!user) {
          setToast({ type: "error", message: "Please login to edit products" });
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        
        const product = await fetchProductById(id);
        
        setForm({
          name: product.name || "",
          image: product.image || product.img || "",
          price: product.price || "",
          originCountry: product.originCountry || product.country || "",
          rating: product.rating || "",
          availableQuantity: product.availableQuantity || "",
          description: product.description || "",
        });
      } catch (error) {
        console.error("Error loading product:", error);
        setToast({ type: "error", message: "Failed to load product" });
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

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
    };

    try {
      await updateProduct(id, payload);
      setToast({ type: "success", message: "Product updated successfully!" });
      setTimeout(() => {
        navigate(`/product/${id}`);
      }, 1500);
    } catch (error) {
      setToast({ type: "error", message: error.message || "Update failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-linear-to-br from-slate-100 via-white to-slate-50">
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
          Update Product
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

        <div className="flex gap-3">
          <button type="button" className="btn btn-outline flex-1" onClick={() => navigate(`/product/${id}`)}>
            Cancel
          </button>
          <button className="btn flex-1 text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all" disabled={submitting}>
            {submitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;

