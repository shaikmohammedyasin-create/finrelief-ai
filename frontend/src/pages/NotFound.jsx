import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="gradient-text font-display text-7xl font-bold">404</span>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-secondary">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
