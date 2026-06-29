import { Menu, Search, Moon, Bell, ChevronDown } from "lucide-react";

export default function Navbar({ setOpen }) {
  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-gray-200 px-4 flex items-center justify-between">

      {/* Lado izquierdo */}
      <div className="flex items-center gap-6">

        {/* Botón menú */}
        <button onClick={() => setOpen(true)} className="lg:hidden w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
          <Menu size={22} />
        </button>

        {/* Buscador */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input type="text" placeholder="Buscar productos..." className="w-96 h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-20 outline-none focus:ring-2 focus:ring-indigo-200" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-500">Ctrl K</div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-4">

        {/* Modo oscuro */}
        <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100">
          <Moon size={20} />
        </button>

        {/* Notificaciones */}
        <button className="relative w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        {/* Usuario */}
        <button className="flex items-center gap-3 hover:bg-gray-100 rounded-xl p-2 transition">
          <img src="https://i.pravatar.cc/100" alt="Usuario" className="w-11 h-11 rounded-full" />
          <div className="hidden md:block text-left">
            <p className="font-semibold text-gray-800">Ariel Aguilar</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <ChevronDown
            size={18}
            className="text-gray-500"
          />
        </button>
      </div>
    </header>
  );
}  