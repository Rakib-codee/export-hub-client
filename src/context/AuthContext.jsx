import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase/Firebase.config.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from backend
  const fetchUserRole = async (userId) => {
    try {
      const response = await fetch(`${API}/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.role || null;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
    return null;
  };

  // Register
  const register = async (name, email, password, photoURL) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name, photoURL: photoURL });
    return res.user;
  };

  // Login
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Logout
  const logout = () => {
    setUserRole(null);
    signOut(auth);
  };

  // Google Sign-In
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user role when user is logged in
        const role = await fetchUserRole(currentUser.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, userRole, loading, register, login, logout, googleSignIn };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
