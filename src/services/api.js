import axios from "axios";

const baseURL = import.meta?.env?.VITE_API_BASE_URL || "";

export const api = axios.create({
	baseURL
});

export const fetchLatestProducts = async (limit = 6) => {
	const res = await api.get(`/products`, {
		params: {
			limit,
			sort: "-createdAt"
		}
	});
	return res.data?.items || res.data;
};

export const fetchProductById = async (id) => {
	const res = await api.get(`/products/${id}`);
	return res.data;
};

export const fetchAllProducts = async ({ page = 1, limit = 12, search = "" } = {}) => {
	const res = await api.get(`/products`, {
		params: {
			page,
			limit,
			search,
			sort: "-createdAt"
		}
	});
	return res.data;
};

export const fetchMyExports = async (exporterUserId) => {
	const res = await api.get(`/products`, {
		params: {
			exporterUserId,
			sort: "-createdAt",
			limit: 0
		}
	});
	return res.data?.items || [];
};

export const createProduct = async (payload) => {
	const res = await api.post(`/products`, payload);
	return res.data;
};

export const updateProduct = async (id, payload) => {
	const res = await api.patch(`/products/${id}`, payload);
	return res.data;
};

export const deleteProduct = async (id) => {
	const res = await api.delete(`/products/${id}`);
	return res.data;
};

export const createImport = async (payload) => {
	const res = await api.post(`/imports`, payload);
	return res.data;
};

export const fetchMyImports = async (userId) => {
	const res = await api.get(`/imports`, { params: { userId } });
	return res.data;
};

export const deleteImport = async (id) => {
	const res = await api.delete(`/imports/${id}`);
	return res.data;
};


