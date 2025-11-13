import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState("");

  const totalPages = useMemo(
    () => (limit ? Math.ceil(total / limit) : 1),
    [total, limit]
  );

  useEffect(() => {
    document.title = "Import Export Hub | All Products";

    const dummyProducts = [
      {
        _id: 1,
        name: "Organic Mango Pulp",
        price: 120,
        originCountry: "Bangladesh",
        availableQuantity: 250,
        description: "Freshly processed mango pulp",
        image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
        rating: 4.8,
      },
      {
        _id: 2,
        name: "Handmade Jute Bags",
        price: 45,
        originCountry: "India",
        availableQuantity: 500,
        description: "Eco-friendly jute bags",
        image: "https://images.unsplash.com/photo-1616627563025-6b66c8c9c1cf",
        rating: 4.6,
      },
      {
        _id: 3,
        name: "Premium Basmati Rice",
        price: 95,
        originCountry: "Pakistan",
        availableQuantity: 800,
        description: "Long-grain aged basmati rice",
        image: "https://images.unsplash.com/photo-1589308078055-5a123f6f9b6c",
        rating: 4.9,
      },
      {
        _id: 4,
        name: "Ceramic Home Decor",
        price: 70,
        originCountry: "China",
        availableQuantity: 300,
        description: "Beautiful handmade ceramic items",
        image: "https://images.unsplash.com/photo-1616627457671-1a74a4f19a02",
        rating: 4.7,
      },
      {
        _id: 5,
        name: "Spices Export Pack",
        price: 130,
        originCountry: "Sri Lanka",
        availableQuantity: 600,
        description: "Mixed export pack with turmeric, cumin, chili powder",
        image: "https://images.unsplash.com/photo-1620912189866-b1c743d74d5d",
        rating: 4.8,
      },
      {
        _id: 6,
        name: "Leather Wallets",
        price: 80,
        originCountry: "Italy",
        availableQuantity: 350,
        description: "High-quality handcrafted leather wallets",
        image: "https://images.unsplash.com/photo-1621609771445-94b84f2b61d9",
        rating: 4.5,
      },
    ];

    setItems(dummyProducts);
    setTotal(dummyProducts.length);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 px-4 md:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
        All Products
      </h1>

      <div className="flex items-center gap-3 mb-8 max-w-lg mx-auto">
        <input
          className="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-xl"
          placeholder="🔍 Search by product name or origin country"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm mb-4">{error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="w-full h-52 bg-gray-200 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.originCountry.toLowerCase().includes(search.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {product.originCountry}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <p className="text-blue-600 font-semibold text-lg">
                        ${product.price}
                      </p>
                      <div className="flex items-center text-yellow-500 text-sm font-medium">
                        ⭐ {product.rating}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      Available:{" "}
                      <span className="font-semibold text-gray-800">
                        {product.availableQuantity}
                      </span>
                    </p>

                    <Link
                      to={`/product/${product._id}`}
                      className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-all shadow hover:shadow-lg"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-3">
              <button
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <div className="px-4 py-2 text-sm font-medium text-gray-600">
                Page {page} of {totalPages}
              </div>
              <button
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
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
