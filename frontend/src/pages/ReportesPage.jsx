import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import './ReportesPage.css';

export default function ReportesPage() {
    const reportes = [
        { titulo: 'Ingresos Mensuales', valor: 'Bs. 45,230', cambio: '+12%', icon: DollarSign, color: '#10b981' },
        { titulo: 'Reservas Totales', valor: '1,234', cambio: '+8%', icon: Users, color: '#667eea' },
        { titulo: 'Ocupación Promedio', valor: '78%', cambio: '+5%', icon: TrendingUp, color: '#f59e0b' },
        { titulo: 'Ingresos por Multas', valor: 'Bs. 2,150', cambio: '-3%', icon: BarChart3, color: '#ef4444' },
    ];

    return (
        <div className="reportes-page">
            <div className="reportes-header">
                <div>
                    <h1>Reportes Financieros</h1>
                    <p>Análisis y estadísticas del sistema</p>
                </div>
                <button className="btn-generar">
                    <BarChart3 size={20} />
                    Generar Reporte
                </button>
            </div>

            <div className="reportes-grid">
                {reportes.map((reporte, index) => (
                    <div key={index} className="reporte-card">
                        <div className="reporte-icon" style={{ backgroundColor: `${reporte.color}15`, color: reporte.color }}>
                            <reporte.icon size={28} />
                        </div>
                        <div className="reporte-content">
                            <p className="reporte-titulo">{reporte.titulo}</p>
                            <h3 className="reporte-valor">{reporte.valor}</h3>
                            <span className="reporte-cambio" style={{ color: reporte.cambio.startsWith('+') ? '#10b981' : '#ef4444' }}>
                                {reporte.cambio} vs mes anterior
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="reportes-section">
                <h2>Reportes Disponibles</h2>
                <div className="reportes-list">
                    <div className="reporte-item">
                        <BarChart3 size={20} />
                        <span>Reporte de Ingresos Mensual</span>
                        <button className="btn-descargar">Descargar PDF</button>
                    </div>
                    <div className="reporte-item">
                        <BarChart3 size={20} />
                        <span>Reporte de Ocupación</span>
                        <button className="btn-descargar">Descargar PDF</button>
                    </div>
                    <div className="reporte-item">
                        <BarChart3 size={20} />
                        <span>Reporte de Multas y Cobros</span>
                        <button className="btn-descargar">Descargar PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
