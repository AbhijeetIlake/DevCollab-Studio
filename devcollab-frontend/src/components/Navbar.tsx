// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center shadow">
      <Link to="/dashboard" className="text-xl font-bold text-white">
        DevCollab
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-white">{user.username}</span>
            <Link to="/invites" className="text-gray-300 hover:text-white">
              Invites
            </Link>
            <button
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
