import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const MyExports = () => {
  const { user } = useAuth();
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Import Export Hub | My Exports";

    if (!user) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/exports?userId=${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch exports");
        const data = await res.json();
        if (mounted) setExports(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load exports");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [user]);

  if (!user) return <p className="text-center mt-16 text-red-500">Please login to view your exports.</p>;

  return (
    <div className="min-h-screen px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">My Exports</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && exports.length === 0 && <p className="text-center text-gray-600">No exports found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exports.map((exp) => (
          <div key={exp._id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h2 className="font-bold text-lg mb-1">{exp.productName}</h2>
            <p className="text-gray-600 mb-1">Quantity: <span className="font-semibold">{exp.quantity}</span></p>
            <p className="text-gray-600 mb-1">Price per Unit: <span className="font-semibold">${exp.price}</span></p>
            <p className="text-gray-500 text-sm">Date: {new Date(exp.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyExports;
