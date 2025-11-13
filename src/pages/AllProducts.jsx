import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const AllProducts = () => {
  const data = useLoaderData(); 
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState("");

  useEffect(() => {
    document.title = "Import Export Hub | All Products";

    if (data && Array.isArray(data)) {
      setItems(data);
    }
    setLoading(false);
  }, [data]);

  const filteredItems = items.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.originCountry.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / limit);

  const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);

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
      ) : paginatedItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-16">
          No products found.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((product) => (
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
