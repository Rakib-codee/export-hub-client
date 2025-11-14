// =======================
// Dummy data for frontend testing
// =======================
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Products for AllProducts & MyExports/MyImports
let products = [
  {
    _id: "1",
    name: "Organic Mango Pulp",
    description: "Freshly processed mango pulp",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
    originCountry: "India",
    price: 12.5,
    rating: 4.8,
    availableQuantity: 100,
  },
  {
    _id: "2",
    name: "Handmade Jute Bags",
    description: "Eco-friendly jute bags",
    image: "https://images.unsplash.com/photo-1616627563025-6b66c8c9c1cf",
    originCountry: "Bangladesh",
    price: 5,
    rating: 4.6,
    availableQuantity: 200,
  },
  {
    _id: "3",
    name: "Premium Basmati Rice",
    description: "Long-grain aged basmati rice",
    image: "https://images.unsplash.com/photo-1589308078055-5a123f6f9b6c",
    originCountry: "India",
    price: 20,
    rating: 4.9,
    availableQuantity: 50,
  },
  {
    _id: "4",
    name: "Ceramic Home Decor",
    description: "Beautiful handmade ceramic items",
    image: "https://images.unsplash.com/photo-1616627457671-1a74a4f19a02",
    originCountry: "Vietnam",
    price: 15,
    rating: 4.7,
    availableQuantity: 80,
  },
  {
    _id: "5",
    name: "Spices Export Pack",
    description: "Mixed export pack with turmeric, cumin, chili powder",
    image: "https://images.unsplash.com/photo-1620912189866-b1c743d74d5d",
    originCountry: "India",
    price: 8,
    rating: 4.8,
    availableQuantity: 150,
  },
];

// =======================
// All Products API
// =======================
export const fetchAllProducts = async ({ page = 1, limit = 12, search = "" }) => {
  let filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.originCountry.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);

  return new Promise((resolve) => setTimeout(() => resolve({ items, total }), 300));
};

// =======================
// My Imports API
// =======================
let myImports = [
  {
    _id: "imp1",
    productId: "1",
    quantity: 10,
    productSnapshot: products[0],
  },
  {
    _id: "imp2",
    productId: "3",
    quantity: 5,
    productSnapshot: products[2],
  },
];

export const fetchMyImports = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(myImports), 300));
};

export const deleteImport = async (id) => {
  myImports = myImports.filter((x) => x._id !== id);
  return new Promise((resolve) => setTimeout(() => resolve(true), 200));
};

// =======================
// My Exports API
// =======================
let myExports = [
  {
    _id: "exp1",
    productId: "2",
    name: "Handmade Jute Bags",
    image: products[1].image,
    price: 5,
    originCountry: "Bangladesh",
    rating: 4.6,
    availableQuantity: 200,
    description: "Eco-friendly jute bags",
  },
  {
    _id: "exp2",
    productId: "5",
    name: "Spices Export Pack",
    image: products[4].image,
    price: 8,
    originCountry: "India",
    rating: 4.8,
    availableQuantity: 150,
    description: "Mixed export pack with turmeric, cumin, chili powder",
  },
];

export const fetchMyExports = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(myExports), 300));
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API}/models/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API}/models/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// =======================
// Create Product API
// =======================
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API}/models`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// =======================
// Create Import API
// =======================
export const createImport = async (importData) => {
  try {
    const response = await fetch(`${API}/imports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(importData),
    });

    if (!response.ok) {
      throw new Error("Failed to create import");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating import:", error);
    throw error;
  }
};

// =======================
// Create Export API
// =======================
export const createExport = async (exportData) => {
  try {
    const response = await fetch(`${API}/exports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exportData),
    });

    if (!response.ok) {
      throw new Error("Failed to create export");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating export:", error);
    throw error;
  }
};

// =======================
// Product Details API
// =======================
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API}/models/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
