import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    QrCode,
    LogOut,
    Menu,
    X,
    CreditCard,
    FileText,
    Building2,
    Grid,
    Calendar,
    DollarSign,
    Receipt,
    Ticket,
    BarChart3
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'OPERADOR', 'CONDUCTOR'] },

        // Módulo Santiago
        { label: 'Reservar', icon: Calendar, path: '/dashboard/reservar', roles: ['CONDUCTOR'] },
        { label: 'Mis Reservas', icon: FileText, path: '/dashboard/mis-reservas', roles: ['CONDUCTOR'] },
        { label: 'Gestión de Reservas', icon: FileText, path: '/dashboard/gestion-reservas', roles: ['OPERADOR', 'ADMIN'] },
        { label: 'Check-In/Out', icon: QrCode, path: '/dashboard/scanner', roles: ['OPERADOR'] },
        { label: 'Pases Mensuales', icon: Ticket, path: '/dashboard/pases', roles: ['ADMIN', 'OPERADOR'] },

        // Módulo Diego
        { label: 'Sedes', icon: Building2, path: '/dashboard/sedes', roles: ['ADMIN'] },
        { label: 'Espacios', icon: Grid, path: '/dashboard/espacios', roles: ['ADMIN', 'OPERADOR'] },

        // Módulo Alfredo
        { label: 'Tarifas', icon: CreditCard, path: '/dashboard/tarifas', roles: ['ADMIN'] },
        { label: 'Cobros', icon: DollarSign, path: '/dashboard/cobros', roles: ['ADMIN', 'OPERADOR'] },
        { label: 'Facturación', icon: Receipt, path: '/dashboard/facturacion', roles: ['ADMIN', 'OPERADOR'] },
        { label: 'Reportes', icon: BarChart3, path: '/dashboard/reportes', roles: ['ADMIN'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    {sidebarOpen && (
                        <div className="brand">
                            <Car className="brand-icon" />
                            <span className="brand-text">ParkingPro</span>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {filteredMenu.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className={`user-info ${!sidebarOpen ? 'collapsed' : ''}`}>
                        <div className="user-avatar">
                            {user?.nombre?.charAt(0)}
                        </div>
                        {sidebarOpen && (
                            <div className="user-details">
                                <p className="user-name">{user?.nombre}</p>
                                <p className="user-role">{user?.role}</p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="main-header">
                    <h1>Hola, {user?.nombre?.split(' ')[0]} 👋</h1>
                    <p>Bienvenido al Panel de Control</p>
                </div>

                <div className="main-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
