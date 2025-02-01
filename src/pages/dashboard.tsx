import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <p>You are not logged in. Please sign in.</p>
      )}
      {/* Show user's decks, stats, streaks, etc. */}
    </div>
  );
}
