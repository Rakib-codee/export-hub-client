import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const MyImports = () => {
  const { user } = useAuth();
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Import Export Hub | My Imports";

    if (!user) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`${API}/imports?userId=${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch imports");
        const data = await res.json();
        if (mounted) setImports(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load imports");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user]);

  const totalQuantity = useMemo(() => 
    imports.reduce((sum, imp) => sum + (imp.quantity || 0), 0), 
    [imports]
  );

  const totalValue = useMemo(() => 
    imports.reduce((sum, imp) => sum + ((imp.quantity || 0) * (imp.price || 0)), 0), 
    [imports]
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-red-500 text-lg font-semibold">Please login to view your imports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 mb-4">
            📥 My Imports
          </h1>
          <p className="text-gray-600 text-lg">Track all your imported products</p>
        </div>

        {/* Statistics Cards */}
        {!loading && imports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Imports</p>
                  <p className="text-3xl font-bold text-blue-600">{imports.length}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Quantity</p>
                  <p className="text-3xl font-bold text-green-600">{totalQuantity}</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-purple-600">${totalValue.toFixed(2)}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading your imports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <span className="text-red-500 text-2xl mr-3">⚠️</span>
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && imports.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Imports Yet</h3>
            <p className="text-gray-600 mb-6">You haven't imported any products yet.</p>
            <a href="/all-products" className="btn btn-primary btn-lg">
              Browse Products
            </a>
          </div>
        )}

        {/* Imports Grid */}
        {!loading && imports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imports.map((imp) => (
              <div 
                key={imp._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
              >
                <div className="bg-linear-to-r from-blue-500 to-indigo-500 p-4">
                  <h2 className="font-bold text-xl text-white">{imp.productName}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600 font-medium">📦 Quantity:</span>
                      <span className="font-bold text-blue-600 text-lg">{imp.quantity}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600 font-medium">💰 Price/Unit:</span>
                      <span className="font-bold text-green-600 text-lg">${imp.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-600 font-medium">💵 Total:</span>
                      <span className="font-bold text-purple-600 text-lg">
                        ${((imp.quantity || 0) * (imp.price || 0)).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">📅</span>
                        <span>{new Date(imp.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyImports;
