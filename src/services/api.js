const API = import.meta.env.VITE_API_BASE_URL || "https://export-hub-server.vercel.app";

// =======================
// Delete Product API
// =======================
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

// =======================
// Update Product API
// =======================
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
