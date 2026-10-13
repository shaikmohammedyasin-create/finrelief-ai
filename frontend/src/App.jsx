import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import About from "./pages/About.jsx";
import Features from "./pages/Features.jsx";
import FinancialProfile from "./pages/FinancialProfile.jsx";
import Landing from "./pages/Landing.jsx";
import NegotiationLetterPage from "./pages/NegotiationLetterPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Pricing from "./pages/Pricing.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AIHistory from "./pages/history/AIHistory.jsx";
import LoanManagement from "./pages/loans/LoanManagement.jsx";
import KnowYourRights from "./pages/rights/KnowYourRights.jsx";
import SettlementPrediction from "./pages/settlement/SettlementPrediction.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public marketing pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="loans" element={<LoanManagement />} />
        <Route path="financial-profile" element={<FinancialProfile />} />
        <Route path="settlement" element={<SettlementPrediction />} />
        <Route path="negotiation" element={<NegotiationLetterPage />} />
        <Route path="history" element={<AIHistory />} />
        <Route path="rights" element={<KnowYourRights />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
