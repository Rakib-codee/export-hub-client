import { useEffect, useState } from "react";
import { deleteImport, fetchMyImports } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

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
      } catch {
        if (active) setToast({ type: "error", message: "Failed to load imports" });
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
          className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} 
            max-w-xl mx-auto mb-6 shadow-md animate-fade-in`}
        >
          <span>{toast.message}</span>
          <button className="btn btn-sm btn-ghost ml-auto" onClick={() => setToast(null)}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it) => (
            <div
              key={it._id}
              className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl 
              border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg 
              hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <img
                src={it.productSnapshot?.image || "https://via.placeholder.com/300"}
                alt={it.productSnapshot?.name}
                className="w-full h-56 object-cover rounded-t-2xl"
              />

              <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {it.productSnapshot?.name}
                </h2>

                <div className="flex items-center gap-2 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {it.productSnapshot?.rating || "N/A"} / 5
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Origin:</strong> {it.productSnapshot?.originCountry || "Unknown"}
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Price:</strong>{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ${it.productSnapshot?.price}
                  </span>
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Imported Qty:</strong>{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {it.quantity}
                  </span>
                </p>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/product/${it.productId}`}
                    className="btn btn-outline btn-primary btn-sm rounded-lg"
                  >
                    See Details
                  </Link>
                  <button
                    onClick={() => removeImport(it._id)}
                    className="btn btn-error btn-sm text-white rounded-lg"
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
