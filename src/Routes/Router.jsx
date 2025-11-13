import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import AllProducts from "../pages/AllProducts.jsx";
import MyExports from "../pages/MyExports.jsx";
import MyImports from "../pages/MyImports.jsx";
import AddProduct from "../pages/AddProduct.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-products", 
		element: <AllProducts />,
	  	 loader: () => fetch("http://localhost:3000/models"),				
	},
      { path: "/product/:id", element: <ProductDetails /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/my-exports", element: <MyExports /> },
          { path: "/my-imports", element: <MyImports /> },
          { path: "/add-product", element: <AddProduct />, 
			 loader: () => fetch("http://localhost:3000/models"),
       },
        ],
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default router;
