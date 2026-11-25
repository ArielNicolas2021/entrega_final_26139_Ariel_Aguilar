import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductosPage } from '../pages/ProductosPage.jsx'
import { MainLayout } from '../components/MainLayout.jsx'
import { CategoriasPage } from '../pages/CategoriasPage.jsx'
import FacturarVenta from '../pages/FacturarVenta.jsx'
import { VentasPage } from '../pages/VentasPage.jsx'
import { CreateProduct } from '../components/productos/CreateProduct.jsx'
import { EditProduct } from '../components/productos/EditProduct.jsx'
import { MarcasPage } from '../pages/MarcasPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'

export const RoutesProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}> {/* En MainLayout se encuentra el sidebar y el navbar */}

          <Route index element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/crear-producto" element={<CreateProduct />} />
          <Route path="/productos/editar-producto/:id" element={<EditProduct />} />

          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/marcas" element={<MarcasPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/ventas/facturar" element={<FacturarVenta />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
