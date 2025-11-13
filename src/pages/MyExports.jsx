import { useEffect, useMemo, useState, useCallback } from "react";
import { deleteProduct, fetchMyExports, updateProduct } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const MyExports = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [edit, setEdit] = useState(null);
  const hasItems = useMemo(() => items.length > 0, [items]);

  // --- Refetch function ---
  const loadExports = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchMyExports(user.uid);
      setItems(res);
    } catch {
      setToast({ type: "error", message: "Failed to load exports" });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    document.title = "Import Export Hub | My Exports";
    loadExports();
  }, [loadExports]);

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      setToast({ type: "success", message: "Deleted product" });
    } catch {
      setToast({ type: "error", message: "Failed to delete" });
    }
  };

  const openEdit = (item) => setEdit({ ...item });
  const closeEdit = () => setEdit(null);

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const { _id, name, image, price, originCountry, rating, availableQuantity, description } = edit;
      const payload = {
        name,
        image,
        price: Number(price),
        originCountry,
        rating: Number(rating || 0),
        availableQuantity: Number(availableQuantity || 0),
        description: description || ""
      };
      const updated = await updateProduct(_id, payload);
      setItems((prev) => prev.map((x) => (x._id === _id ? updated : x)));
      setToast({ type: "success", message: "Updated product" });
      closeEdit();
    } catch {
      setToast({ type: "error", message: "Failed to update" });
    }
  };

  const downloadCSV = () => {
    const headers = ["Name","Price","Origin Country","Rating","Available Quantity"];
    const rows = items.map((p) => [p.name, p.price, p.originCountry, p.rating, p.availableQuantity]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-exports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">My Exports</h1>

      {toast && (
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} max-w-xl mx-auto mb-4`}>
          <span>{toast.message}</span>
          <button className="btn btn-sm btn-ghost ml-auto" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button className="btn btn-sm btn-outline" disabled={!hasItems} onClick={downloadCSV}>Download CSV</button>
        <button className="btn btn-sm btn-primary ml-2" onClick={loadExports}>Refresh</button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : !hasItems ? (
        <p className="text-center text-gray-600">You have no exports yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it._id} className="border rounded-lg p-4 bg-base-100">
              <div className="flex gap-4">
                <img src={it.image} alt={it.name} className="w-24 h-24 object-cover rounded"/>
                <div className="flex-1">
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-gray-600">Origin: {it.originCountry}</div>
                  <div className="text-sm">Price: ${it.price}</div>
                  <div className="text-sm">Rating: {it.rating}</div>
                  <div className="text-sm">Available: {it.availableQuantity}</div>
                  <div className="mt-2 flex gap-2">
                    <button className="btn btn-sm" onClick={() => openEdit(it)}>Update</button>
                    <button className="btn btn-sm btn-error" onClick={() => removeProduct(it._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {edit && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Update Product</h3>
            <form onSubmit={saveEdit} className="space-y-3">
              <input className="input input-bordered w-full" value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} required />
              <input className="input input-bordered w-full" value={edit.image} onChange={(e) => setEdit((p) => ({ ...p, image: e.target.value }))} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input input-bordered w-full" type="number" min="0" value={edit.price} onChange={(e) => setEdit((p) => ({ ...p, price: e.target.value }))} required />
                <input className="input input-bordered w-full" value={edit.originCountry} onChange={(e) => setEdit((p) => ({ ...p, originCountry: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input input-bordered w-full" type="number" min="0" max="5" step="0.1" value={edit.rating} onChange={(e) => setEdit((p) => ({ ...p, rating: e.target.value }))} />
                <input className="input input-bordered w-full" type="number" min="0" value={edit.availableQuantity} onChange={(e) => setEdit((p) => ({ ...p, availableQuantity: e.target.value }))} required />
              </div>
              <textarea className="textarea textarea-bordered w-full" value={edit.description || ""} onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))} />
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>Cancel</button>
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyExports;
