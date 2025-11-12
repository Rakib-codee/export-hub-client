import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="p-4 max-w-7xl mx-auto px-4 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
