import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import AllProducts from "../pages/AllProducts.jsx";
import MyExports from "../pages/MyExports.jsx";
import MyImports from "../pages/MyImports.jsx";
import AddProduct from "../pages/AddProduct.jsx";
import UpdateProduct from "../pages/UpdateProduct.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },

      {
        path: "/all-products",
        element: <AllProducts />,
        loader: () => fetch(`${API}/models`).then((res) => res.json()),
      },

      {
        path: "/product/:id",
        element: <ProductDetails />,
        loader: ({ params }) =>
          fetch(`${API}/models/${params.id}`).then((res) => res.json()),
      },

      {
        element: <PrivateRoute />,
        children: [
          { path: "/my-exports", element: <MyExports /> },
          { path: "/my-imports", element: <MyImports /> },
          {
            path: "/add-product",
            element: <AddProduct />,
            loader: () => fetch(`${API}/models`).then((res) => res.json()),
          },
          {
            path: "/update-product/:id",
            element: <UpdateProduct />,
          },
        ],
      },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default router;
