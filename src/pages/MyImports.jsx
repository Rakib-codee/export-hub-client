import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const MyImports = () => {
  const { user } = useAuth();  // Get current logged-in user from AuthContext
  const [imports, setImports] = useState([]);  // State to store imports data
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState("");  // State to manage error

  useEffect(() => {
    document.title = "Import Export Hub | My Imports";

    // If no user is logged in, return early
    if (!user) return;

    let mounted = true;

    // Fetch imports for the user
    (async () => {
      try {
        const res = await fetch(`${API}/imports?userId=${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch imports");
        const data = await res.json();
        if (mounted) setImports(data);  // Update state with fetched data
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load imports");
      } finally {
        if (mounted) setLoading(false);  // Set loading to false once fetching is done
      }
    })();

    return () => {
      mounted = false;  // Cleanup
    };
  }, [user]);

  if (!user) return <p className="text-center mt-16 text-red-500">Please login to view your imports.</p>;

  return (
    <div className="min-h-screen px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">My Imports</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && imports.length === 0 && <p className="text-center text-gray-600">No imports found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {imports.map((imp) => (
          <div key={imp._id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h2 className="font-bold text-lg mb-1">{imp.productName}</h2>
            <p className="text-gray-600 mb-1">Quantity: <span className="font-semibold">{imp.quantity}</span></p>
            <p className="text-gray-600 mb-1">Price per Unit: <span className="font-semibold">${imp.price}</span></p>
            <p className="text-gray-500 text-sm">Date: {new Date(imp.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyImports;
