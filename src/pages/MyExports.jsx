import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
const API = import.meta.env.VITE_API_BASE_URL || "https://export-hub-server.vercel.app";

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
        const res = await fetch(`${API}/exports?userId=${user.uid}`);
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

    return () => {
      mounted = false;
    };
  }, [user]);

  const totalQuantity = useMemo(() => 
    exports.reduce((sum, exp) => sum + (exp.quantity || 0), 0), 
    [exports]
  );

  const totalValue = useMemo(() => 
    exports.reduce((sum, exp) => sum + ((exp.quantity || 0) * (exp.price || 0)), 0), 
    [exports]
  );

  const downloadCSV = () => {
    if (exports.length === 0) return;

    // CSV Headers
    const headers = [
      'Product Name',
      'Quantity',
      'Price per Unit',
      'Total Value',
      'Date'
    ];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...exports.map(exp => {
        const total = (exp.quantity || 0) * (exp.price || 0);
        const date = new Date(exp.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        return [
          `"${(exp.productName || '').replace(/"/g, '""')}"`,
          exp.quantity || 0,
          exp.price || 0,
          total.toFixed(2),
          `"${date}"`
        ].join(',');
      })
    ];

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `my-exports-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-red-500 text-lg font-semibold">Please login to view your exports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600 mb-4">
            📤 My Exports
          </h1>
          <p className="text-gray-600 text-lg mb-6">Track all your exported products</p>
          {!loading && exports.length > 0 && (
            <button
              onClick={downloadCSV}
              className="btn btn-success btn-lg shadow-lg hover:shadow-xl transition-all"
            >
              📥 Download CSV
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        {!loading && exports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Exports</p>
                  <p className="text-3xl font-bold text-green-600">{exports.length}</p>
                </div>
                <div className="text-4xl">🚢</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Quantity</p>
                  <p className="text-3xl font-bold text-blue-600">{totalQuantity}</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-amber-600">${totalValue.toFixed(2)}</p>
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
              <div className="loading loading-spinner loading-lg text-green-600"></div>
              <p className="mt-4 text-gray-600">Loading your exports...</p>
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
        {!loading && exports.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Exports Yet</h3>
            <p className="text-gray-600 mb-6">You haven't exported any products yet.</p>
            <a href="/add-product" className="btn btn-success btn-lg">
              Add Product
            </a>
          </div>
        )}

        {/* Exports Grid */}
        {!loading && exports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exports.map((exp) => (
              <div 
                key={exp._id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
              >
                <div className="bg-linear-to-r from-green-500 to-emerald-500 p-4">
                  <h2 className="font-bold text-xl text-white">{exp.productName}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-600 font-medium">📦 Quantity:</span>
                      <span className="font-bold text-green-600 text-lg">{exp.quantity}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-600 font-medium">💰 Price/Unit:</span>
                      <span className="font-bold text-blue-600 text-lg">${exp.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <span className="text-gray-600 font-medium">💵 Total:</span>
                      <span className="font-bold text-amber-600 text-lg">
                        ${((exp.quantity || 0) * (exp.price || 0)).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">📅</span>
                        <span>{new Date(exp.createdAt).toLocaleDateString('en-US', { 
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

export default MyExports;
