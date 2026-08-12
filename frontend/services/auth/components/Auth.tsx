"use client";

import { useState } from "react";
import {
  login,
  getCurrentUser,
  logout,
} from "@/services/auth/api/auth.service";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Login user
   */
  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      setResult(response);

      console.log("Login response:", response);
    } catch (error) {
      console.error("Login error:", error);
      setResult(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get current authenticated user
   */
  const handleGetMe = async () => {
    try {
      setLoading(true);

      const response = await getCurrentUser();

      setResult(response);

      console.log("Current user:", response);
    } catch (error) {
      console.error("Get me error:", error);
      setResult(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout current device
   */
  const handleLogout = async () => {
    try {
      setLoading(true);

      const response = await logout();

      setResult(response);

      console.log("Logout response:", response);
    } catch (error) {
      console.error("Logout error:", error);
      setResult(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Auth Test</h1>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border p-2"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded border p-2"
      />

      {/* Login */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded bg-black p-2 text-white"
      >
        {loading ? "Loading..." : "Login"}
      </button>

      {/* Get Current User */}
      <button
        onClick={handleGetMe}
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 text-white"
      >
        Get Current User
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full rounded bg-red-600 p-2 text-white"
      >
        Logout
      </button>

      {/* Response */}
      <pre className="overflow-auto rounded p-4 text-sm">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
