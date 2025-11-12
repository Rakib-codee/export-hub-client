import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useMemo, useState } from "react";

const AllProducts = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState("");

  const totalPages = useMemo(() => (limit ? Math.ceil(total / limit) : 1), [total, limit]);

  useEffect(() => {
    document.title = "Import Export Hub | All Products";

    
    const dummyProducts = [
      { _id: 1, name: "Organic Mango Pulp", description: "Freshly processed mango pulp", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2", rating: 4.8 },
      { _id: 2, name: "Handmade Jute Bags", description: "Eco-friendly jute bags", image: "https://images.unsplash.com/photo-1616627563025-6b66c8c9c1cf", rating: 4.6 },
      { _id: 3, name: "Premium Basmati Rice", description: "Long-grain aged basmati rice", image: "https://images.unsplash.com/photo-1589308078055-5a123f6f9b6c", rating: 4.9 },
      { _id: 4, name: "Ceramic Home Decor", description: "Beautiful handmade ceramic items", image: "https://images.unsplash.com/photo-1616627457671-1a74a4f19a02", rating: 4.7 },
      { _id: 5, name: "Spices Export Pack", description: "Mixed export pack with turmeric, cumin, chili powder", image: "https://images.unsplash.com/photo-1620912189866-b1c743d74d5d", rating: 4.8 },
      { _id: 6, name: "Leather Wallets", description: "High-quality handcrafted leather wallets", image: "https://images.unsplash.com/photo-1621609771445-94b84f2b61d9", rating: 4.5 },
      { _id: 7, name: "Bamboo Furniture", description: "Sustainable and lightweight bamboo furniture", image: "https://images.unsplash.com/photo-1582582494700-6c84e1baf2b3", rating: 4.7 },
      { _id: 8, name: "Cotton Textiles", description: "Soft cotton fabrics for garments and upholstery", image: "https://images.unsplash.com/photo-1616627561662-fd02d7eb1ed7", rating: 4.4 },
      { _id: 9, name: "Tea Leaf Export Pack", description: "Premium CTC and Green Tea blend", image: "https://images.unsplash.com/photo-1585238342020-96629b94a9d9", rating: 4.9 },
      { _id: 10, name: "Frozen Shrimp", description: "Frozen, cleaned shrimp ready for export", image: "https://images.unsplash.com/photo-1615895276186-1f3a81b9e9f1", rating: 4.8 },
    ];

    setItems(dummyProducts);
    setTotal(dummyProducts.length);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

      <div className="flex items-center gap-3 mb-6">
        <input
          className="input input-bordered w-full"
          placeholder="Search by product name or origin country"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card bg-base-100 border animate-pulse">
              <div className="w-full aspect-4/3 bg-base-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-base-200 rounded w-2/3" />
                <div className="h-3 bg-base-200 rounded w-1/2" />
                <div className="h-8 bg-base-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items
              .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                className="btn btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <div className="px-3 py-2 text-sm">
                Page {page} of {totalPages}
              </div>
              <button
                className="btn btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;
