import { Boxes, FolderTree, LogOut, Package2, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen, onLogout }) {
  const location = useLocation();
  const menu = [
    {
      title: "Productos",
      path: "/productos",
      icon: <Package2 size={20} />,
    },
    {
      title: "Categorías",
      path: "/categorias",
      icon: <FolderTree size={20} />,
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden"/>
      )}

      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-50 transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Boxes
                size={22}
                className="text-white"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl">Product</h1>
              <p className="text-sm text-gray-500">Manager</p>
            </div>
          </div>

          {/* Botón cerrar móvil */}
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menú */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-gray-400 uppercase mb-4">Menú</p>
          <div className="space-y-2">
            {menu.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 transition
                  ${
                    location.pathname === item.path
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-600"
                  }
                `}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t">
          <button onClick={onLogout} className="w-full rounded-xl bg-red-50 text-red-500 py-3 hover:bg-red-100 transition">
            <div className="flex justify-center items-center gap-2" onClick= {onLogout}>
              <LogOut size={18} />
              Cerrar sesión
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}