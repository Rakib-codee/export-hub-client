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
        if (active)
          setToast({ type: "error", message: "Failed to load imports" });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
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
    <div className="min-h-screen py-10 px-4 md:px-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">
        My Imports
      </h1>

      {toast && (
        <div
          className={`alert ${
            toast.type === "success" ? "alert-success" : "alert-error"
          } max-w-xl mx-auto mb-6 shadow-md animate-fade-in`}
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

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-16">
          You haven’t imported any products yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it._id}
              className="card bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
            >
              <figure className="p-4">
                <img
                  src={it.productSnapshot?.image}
                  alt={it.productSnapshot?.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-gray-800 dark:text-white text-lg">
                  {it.productSnapshot?.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Origin: {it.productSnapshot?.originCountry}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Price: <span className="font-semibold">${it.productSnapshot?.price}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Imported Qty:{" "}
                  <span className="font-semibold">{it.quantity}</span>
                </p>

                <div className="card-actions justify-between mt-4">
                  <Link
                    to={`/product/${it.productId}`}
                    className="btn btn-outline btn-primary btn-sm"
                  >
                    See Details
                  </Link>
                  <button
                    onClick={() => removeImport(it._id)}
                    className="btn btn-error btn-sm text-white"
                  >
                    Remove
                  </button>
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
