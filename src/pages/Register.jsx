import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, googleSignIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [role, setRole] = useState("importer"); // Default to importer
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const API = import.meta.env.VITE_API_BASE_URL || "https://export-hub-server.vercel.app";

  useEffect(() => {
    document.title = "Import Export Hub | Register";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Password validation
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain a lowercase letter");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const user = await register(name, email, password, photoURL);
      
      // Save user role to backend
      try {
        await fetch(`${API}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            role: role,
            email: email,
            name: name
          })
        });
      } catch (roleErr) {
        console.error("Failed to save user role:", roleErr);
        // Continue even if role save fails
      }
      
      navigate("/");
    } catch (err) {
      setError("Registration failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;
      
      // Save user role to backend (default to importer for Google sign-in)
      try {
        await fetch(`${API}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            role: "importer", // Default role for Google sign-in
            email: user.email,
            name: user.displayName || "User"
          })
        });
      } catch (roleErr) {
        console.error("Failed to save user role:", roleErr);
      }
      
      navigate("/");
    } catch (err) {
      setError("Google Sign-In failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Photo URL"
          className="input input-bordered w-full"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Your Role</span>
          </label>
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">📥 Importer</span>
              <input
                type="radio"
                name="role"
                value="importer"
                checked={role === "importer"}
                onChange={(e) => setRole(e.target.value)}
                className="radio radio-primary"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-2">📤 Exporter</span>
              <input
                type="radio"
                name="role"
                value="exporter"
                checked={role === "exporter"}
                onChange={(e) => setRole(e.target.value)}
                className="radio radio-primary"
              />
            </label>
          </div>
        </div>
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full">Register</button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-secondary w-full"
        >
          Sign up with Google
        </button>
        <p className="text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
