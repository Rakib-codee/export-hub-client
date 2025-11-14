import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { createImport, createExport, fetchProductById, deleteProduct } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ProductDetails = () => {
  const loaderData = useLoaderData();
  const { id } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(loaderData || null);
  const [loading, setLoading] = useState(!loaderData);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [exportQty, setExportQty] = useState(1);
  const [exportSubmitting, setExportSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const available = useMemo(() => Number(product?.availableQuantity ?? 0), [product]);
  const disableSubmit = useMemo(() => !qty || qty < 1 || qty > available || !user, [qty, available, user]);
  const canEditDelete = useMemo(() => user !== null, [user]);

  // Debug: Log user role
  useEffect(() => {
    if (user) {
      console.log("User Role:", userRole, "User ID:", user.uid);
    }
  }, [user, userRole]);

  useEffect(() => {
    document.title = product?.name ? `Import Export Hub | ${product.name}` : "Import Export Hub | Product Details";
    let mounted = true;

    if (!product) {
      (async () => {
        try {
          const data = await fetchProductById(id);
          if (mounted) setProduct(data);
        } catch (err) {
          console.error(err);
          setError("Failed to load product details. Please try again.");
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }

    return () => { mounted = false; };
  }, [id, product]);
  const handleImport = async (e) => {
    e.preventDefault();
    if (disableSubmit) return;

    try {
      setSubmitting(true);
      const created = await createImport({ userId: user.uid, productId: product._id, quantity: Number(qty) });
      setProduct((prev) => ({ ...prev, availableQuantity: (prev.availableQuantity || 0) - created.quantity }));
      setToast({ type: "success", message: "Product imported successfully!" });
      document.getElementById("import_modal").close();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Import failed!" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();
    if (!user || !exportQty || exportQty < 1) return;

    try {
      setExportSubmitting(true);
      const created = await createExport({ userId: user.uid, productId: product._id, quantity: Number(exportQty) });
      setProduct((prev) => ({ ...prev, availableQuantity: (prev.availableQuantity || 0) + created.quantity }));
      setToast({ type: "success", message: "Product exported successfully!" });
      document.getElementById("export_modal").close();
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Export failed!" });
    } finally {
      setExportSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteProduct(id);
      setToast({ type: "success", message: "Product deleted successfully!" });
      setTimeout(() => {
        navigate("/all-products");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to delete product!" });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full">
        {toast && (
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg mb-6 max-w-2xl mx-auto`}>
            <div className="flex justify-between w-full items-center">
              <span>{toast.message}</span>
              <button className="btn btn-sm btn-ghost" onClick={() => setToast(null)}>✕</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-24 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-red-500 font-medium text-lg">{error}</div>
          </div>
        )}

        {!loading && product && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative bg-linear-to-br from-blue-100 to-indigo-100 p-8 flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
                <img 
                  src={product.img || product.image} 
                  alt={product.name} 
                  className="w-full h-full max-h-[500px] object-contain rounded-2xl shadow-lg" 
                />
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 mb-4">
                    {product.name}
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 font-semibold min-w-[140px]">🌍 Origin:</span>
                      <span className="text-gray-700">{product.originCountry || product.country}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 font-semibold min-w-[140px]">💰 Price:</span>
                      <span className="text-gray-800 font-bold text-xl">${product.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-600 font-semibold min-w-[140px]">📦 Available:</span>
                      <span className="text-gray-700 font-semibold">{product.availableQuantity ?? "-"} units</span>
                    </div>
                    
                    {product.rating && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-600 font-semibold min-w-[140px]">⭐ Rating:</span>
                        <span className="text-gray-700 font-semibold">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {product.description && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <button 
                        className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl transition-all" 
                        onClick={() => {
                          if (userRole && userRole !== "importer") {
                            setToast({ type: "error", message: "Only importers can import products" });
                            return;
                          }
                          document.getElementById("import_modal").showModal();
                        }} 
                      >
                        📥 Import Now
                      </button>
                      <button 
                        className="btn btn-secondary btn-lg w-full shadow-lg hover:shadow-xl transition-all" 
                        onClick={() => document.getElementById("export_modal").showModal()} 
                      >
                        📤 Export Now
                      </button>
                    </div>
                  ) : (
                    <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <p className="text-sm text-blue-700">
                        Please login to import/export products
                      </p>
                    </div>
                  )}
                  
                  <a 
                    href="/all-products" 
                    className="btn btn-outline btn-lg w-full shadow-md hover:shadow-lg transition-all"
                  >
                    ← Back to Products
                  </a>
                  
                  {canEditDelete && (
                    <div className="pt-4 border-t-2 border-gray-200">
                      <div className="flex gap-3">
                        <button 
                          className="btn btn-warning btn-lg flex-1 shadow-lg hover:shadow-xl transition-all" 
                          onClick={() => navigate(`/update-product/${id}`)}
                        >
                          ✏️ Edit Product
                        </button>
                        <button 
                          className="btn btn-error btn-lg flex-1 shadow-lg hover:shadow-xl transition-all" 
                          onClick={handleDelete}
                        >
                          🗑️ Delete Product
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <dialog id="import_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Import Product</h3>
          <p className="text-sm text-gray-600 mb-4">Available: {available}</p>
          <form onSubmit={handleImport} className="space-y-4">
            <input type="number" min={1} max={available} className="input input-bordered w-full" value={qty} onChange={(e) => setQty(e.target.value)} required />
            <button className="btn btn-primary w-full" disabled={disableSubmit || submitting}>{submitting ? "Importing..." : "Confirm Import"}</button>
          </form>
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById("import_modal").close()}>Close</button>
          </div>
        </div>
      </dialog>

      <dialog id="export_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Export Product</h3>
          <form onSubmit={handleExport} className="space-y-4">
            <input type="number" min={1} className="input input-bordered w-full" value={exportQty} onChange={(e) => setExportQty(e.target.value)} required />
            <button className="btn btn-secondary w-full" disabled={!user || exportSubmitting}>{exportSubmitting ? "Exporting..." : "Confirm Export"}</button>
          </form>
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById("export_modal").close()}>Close</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductDetails;
