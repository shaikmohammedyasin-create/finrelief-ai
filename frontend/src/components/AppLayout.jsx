import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
