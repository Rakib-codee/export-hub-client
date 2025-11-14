import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { createImport, createExport, fetchProductById } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ProductDetails = () => {
  const loaderData = useLoaderData();
  const { id } = useParams();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Product Details</h1>

        {toast && (
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg mb-4`}>
            <div className="flex justify-between w-full">
              <span>{toast.message}</span>
              <button className="btn btn-sm btn-ghost" onClick={() => setToast(null)}>✕</button>
            </div>
          </div>
        )}

        {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse"><div className="h-80 bg-base-200 rounded-lg"></div><div className="space-y-4"><div className="h-6 bg-base-200 rounded w-3/4"></div><div className="h-4 bg-base-200 rounded w-1/2"></div><div className="h-4 bg-base-200 rounded w-2/3"></div><div className="h-24 bg-base-200 rounded w-full"></div><div className="h-10 bg-base-200 rounded w-1/3"></div></div></div>}

        {error && <div className="text-center text-red-500 font-medium">{error}</div>}

        {!loading && product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div><img src={product.img || product.image} alt={product.name} className="w-full h-96 object-cover rounded-2xl shadow-md" /></div>

            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-primary mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2"><span className="font-semibold">Origin:</span> {product.originCountry || product.country}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ${product.price}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Available Quantity:</span> {product.availableQuantity ?? "-"}</p>
              <p className="text-gray-600 mt-3">{product.description}</p>

              <div className="mt-6 flex gap-3">
                <button className="btn btn-primary" onClick={() => document.getElementById("import_modal").showModal()} disabled={!user}>Import Now</button>
                <button className="btn btn-secondary" onClick={() => document.getElementById("export_modal").showModal()} disabled={!user}>Export Now</button>
                <a href="/all-products" className="btn btn-outline">Back to Products</a>
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
