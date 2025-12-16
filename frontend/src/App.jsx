import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

import ReservasPage from './pages/ReservasPage';
import MisReservasPage from './pages/MisReservasPage';
import GestionReservasPage from './pages/GestionReservasPage';
import ScannerPage from './pages/ScannerPage';
import TarifasPage from './pages/TarifasPage';
import SedesPage from './pages/SedesPage';
import EspaciosPage from './pages/EspaciosPage';
import DashboardHome from './pages/DashboardHome';
import CobrosPage from './pages/CobrosPage';
import FacturacionPage from './pages/FacturacionPage';
import PasesMensualesPage from './pages/PasesMensualesPage';
import MembresiasPage from './pages/MembresiasPage';
import DescuentosPage from './pages/DescuentosPage';
import MultasPage from './pages/MultasPage';
import PagosPage from './pages/PagosPage';
import ReportesPage from './pages/ReportesPage';

function AppRoutes() {
    console.log("Rendering AppRoutes");
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardHome />} />
                <Route path="reservar" element={<ReservasPage />} />
                <Route path="mis-reservas" element={<MisReservasPage />} />
                <Route path="gestion-reservas" element={<GestionReservasPage />} />
                <Route path="scanner" element={<ScannerPage />} />
                <Route path="tarifas" element={<TarifasPage />} />
                <Route path="cobros" element={<CobrosPage />} />
                <Route path="facturacion" element={<FacturacionPage />} />
                <Route path="descuentos" element={<DescuentosPage />} />
                <Route path="multas" element={<MultasPage />} />
                <Route path="pases" element={<PasesMensualesPage />} />
                <Route path="pases-mensuales" element={<PasesMensualesPage />} />
                <Route path="membresias" element={<MembresiasPage />} />
                <Route path="pagos" element={<PagosPage />} />
                <Route path="sedes" element={<SedesPage />} />
                <Route path="espacios" element={<EspaciosPage />} />
                <Route path="reportes" element={<ReportesPage />} />
                <Route path="*" element={<div className="glass-panel p-6"><h3>Página no encontrada</h3></div>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
