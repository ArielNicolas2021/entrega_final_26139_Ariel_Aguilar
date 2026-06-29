import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="lg:ml-72">
        <Navbar
          setOpen={setIsOpen}
        />
        <main className="p-2 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}