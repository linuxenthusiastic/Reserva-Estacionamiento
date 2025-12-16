import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import './DashboardHome.css';

export default function DashboardHome() {
    const navigate = useNavigate();

    const stats = [
        { label: 'Espacios Totales', value: '150', icon: Car, color: '#667eea', change: '+12%' },
        { label: 'Reservas Hoy', value: '45', icon: Calendar, color: '#10b981', change: '+8%' },
        { label: 'Ingresos Hoy', value: '$2,450', icon: DollarSign, color: '#f59e0b', change: '+15%' },
        { label: 'Ocupación', value: '78%', icon: TrendingUp, color: '#ef4444', change: '+5%' },
    ];

    const quickActions = [
        { label: 'Nueva Reserva', path: '/dashboard/reservar', icon: Calendar, color: '#667eea' },
        { label: 'Check-In', path: '/dashboard/scanner', icon: Clock, color: '#10b981' },
        { label: 'Ver Espacios', path: '/dashboard/espacios', icon: Car, color: '#f59e0b' },
        { label: 'Facturación', path: '/dashboard/facturacion', icon: DollarSign, color: '#ef4444' },
    ];

    return (
        <div className="dashboard-home">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.label}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                            <span className="stat-change" style={{ color: stat.color }}>{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="actions-grid">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className="action-card"
                            style={{ background: `linear-gradient(135deg, ${action.color}15 0%, ${action.color}05 100%)` }}
                        >
                            <action.icon size={32} style={{ color: action.color }} />
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="recent-activity">
                <h2>Actividad Reciente</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon success">
                            <Calendar size={16} />
                        </div>
                        <div className="activity-content">
                            <p className="activity-title">Nueva reserva creada</p>
                            <p className="activity-time">Hace 5 minutos</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon warning">
                            <Car size={16} />
                        </div>
                        <div className="activity-content">
                            <p className="activity-title">Check-in realizado - Espacio A-023</p>
                            <p className="activity-time">Hace 12 minutos</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon info">
                            <DollarSign size={16} />
                        </div>
                        <div className="activity-content">
                            <p className="activity-title">Pago recibido - $150</p>
                            <p className="activity-time">Hace 25 minutos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
