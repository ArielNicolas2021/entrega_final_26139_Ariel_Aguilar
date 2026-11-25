import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Sidebar } from "./Sidebar.jsx";
import { Navbar } from "./layout/Navbar.jsx";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-bg-main font-sans text-text-main transition-colors">
      {/* Sidebar Responsive */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenedor principal con margen izquierdo adaptativo (`lg:ml-64`) */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Navbar superior (único <header> semántico) */}
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Contenido Dinámico con transición sutil por ruta */}
        <main className="flex-1 p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};