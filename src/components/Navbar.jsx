import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="brand-heading flex items-center gap-2">
            <span className="inline-block w-2.5 h-6 bg-primary rounded-sm" />
            Import Export Hub
          </Link>

          <button className="md:hidden btn btn-ghost btn-sm" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/all-products" className="hover:text-primary">All Products</Link>
            {user && (
              <>
                <Link to="/my-imports" className="hover:text-primary">My Imports</Link>
                <Link to="/my-exports" className="hover:text-primary">My Exports</Link>
                <Link to="/add-product" className="btn btn-sm btn-outline">Add Export</Link>
              </>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">🌞</span>
              <input type="checkbox" className="toggle toggle-sm" checked={theme === "dark"} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />
              <span className="text-sm">🌙</span>
            </label>
            {user ? (
              <div className="flex gap-2 items-center">
                <img src={user.photoURL || "/default-avatar.png"} alt="avatar" className="w-8 h-8 rounded-full"/>
                <button onClick={handleLogout} className="btn btn-sm btn-error">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
            )}
          </div>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/all-products" className="block">All Products</Link>
            {user && (
              <>
                <Link to="/my-imports" className="block">My Imports</Link>
                <Link to="/my-exports" className="block">My Exports</Link>
                <Link to="/add-product" className="btn btn-sm btn-outline w-full">Add Export</Link>
              </>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm">🌞</span>
                <input type="checkbox" className="toggle toggle-sm" checked={theme === "dark"} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />
                <span className="text-sm">🌙</span>
              </label>
            </div>
            {user ? (
              <button onClick={handleLogout} className="btn btn-sm btn-error w-full">Logout</button>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary w-full">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
