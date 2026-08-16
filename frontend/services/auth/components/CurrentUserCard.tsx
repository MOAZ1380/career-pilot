"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, logout, logoutAll } from "../api/auth.service";
import type { CurrentUser } from "../types/auth.types";

export default function CurrentUserCard() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmingLogoutAll, setConfirmingLogoutAll] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const response = await getCurrentUser();

        if (isMounted) {
          setUser(response.data);
        }
      } catch {
        if (isMounted) {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logout();

      router.replace("/login");
    } catch {
      // The access token is cleared by the service either way.
      setError("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const handleLogoutAll = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logoutAll();

      router.replace("/login");
    } catch {
      // The access token is cleared by the service either way.
      setError("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md rounded border p-6 shadow">
        <p className="text-sm text-gray-600">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-md rounded border p-6 shadow">
      <h1 className="mb-2 text-2xl font-bold">Account</h1>

      <p className="mb-6 text-sm text-gray-600">Your CareerPilot account</p>

      <dl className="space-y-3">
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Username</dt>
          <dd className="text-sm font-medium">{user.username}</dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Email</dt>
          <dd className="text-sm font-medium">{user.email}</dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Email status</dt>
          <dd
            className={`text-sm font-medium ${
              user.isVerified ? "text-green-600" : "text-red-500"
            }`}
          >
            {user.isVerified ? "Verified" : "Not verified"}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Member since</dt>
          <dd className="text-sm font-medium">
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </dd>
        </div>
      </dl>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 space-y-2">
        {confirmingLogoutAll ? (
          <>
            <p className="text-sm text-gray-600">
              This will sign you out from all devices. Are you sure?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleLogoutAll}
                disabled={isLoggingOut}
                className="flex-1 rounded bg-red-600 p-2 text-white disabled:opacity-50"
              >
                {isLoggingOut ? "Signing out..." : "Yes, sign out everywhere"}
              </button>

              <button
                type="button"
                onClick={() => setConfirmingLogoutAll(false)}
                disabled={isLoggingOut}
                className="flex-1 rounded border p-2 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
            >
              {isLoggingOut ? "Signing out..." : "Logout"}
            </button>

            <button
              type="button"
              onClick={() => setConfirmingLogoutAll(true)}
              disabled={isLoggingOut}
              className="w-full rounded bg-red-600 p-2 text-white disabled:opacity-50"
            >
              Logout all devices
            </button>
          </>
        )}
      </div>
    </div>
  );
}
