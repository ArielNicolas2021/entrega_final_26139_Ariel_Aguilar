import React from 'react'
import { LoginPage } from '../pages/LoginPage.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { ProductosPage } from '../pages/ProductosPage.jsx'
import MainLayout from '../components/MainLayout.jsx'
import { CategoriasPage } from '../pages/CategoriasPage.jsx'

export const RoutesProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/productos"
            element={<ProductosPage />}
          />
          <Route
            path="/categorias"
            element={<CategoriasPage />}
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
