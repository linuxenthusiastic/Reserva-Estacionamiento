import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import './PagosPage.css';

export default function PagosPage() {
    const [pagos] = useState([
        { id: 1, factura: 'F-001', monto: 150, metodo: 'TARJETA', estado: 'COMPLETADO', fecha: '2025-12-09 10:30' },
        { id: 2, factura: 'F-002', monto: 200, metodo: 'EFECTIVO', estado: 'COMPLETADO', fecha: '2025-12-09 11:15' },
        { id: 3, factura: 'F-003', monto: 75, metodo: 'QR', estado: 'PENDIENTE', fecha: '2025-12-09 12:00' },
    ]);

    const getEstadoIcon = (estado) => {
        if (estado === 'COMPLETADO') return <CheckCircle size={20} />;
        if (estado === 'PENDIENTE') return <Clock size={20} />;
        return <XCircle size={20} />;
    };

    return (
        <div className="pagos-page">
            <div className="pagos-header">
                <div>
                    <h1>Gestión de Pagos</h1>
                    <p>Historial y estado de pagos</p>
                </div>
            </div>

            <div className="pagos-stats">
                <div className="stat-card completados">
                    <CheckCircle size={32} />
                    <div>
                        <p>Pagos Completados</p>
                        <h3>{pagos.filter(p => p.estado === 'COMPLETADO').length}</h3>
                    </div>
                </div>
                <div className="stat-card total">
                    <CreditCard size={32} />
                    <div>
                        <p>Total Recaudado</p>
                        <h3>Bs. {pagos.filter(p => p.estado === 'COMPLETADO').reduce((sum, p) => sum + p.monto, 0)}</h3>
                    </div>
                </div>
            </div>

            <div className="pagos-list">
                {pagos.map(pago => (
                    <div key={pago.id} className="pago-card">
                        <div className={`pago-estado-icon ${pago.estado.toLowerCase()}`}>
                            {getEstadoIcon(pago.estado)}
                        </div>
                        <div className="pago-info">
                            <h3>Pago #{pago.id}</h3>
                            <p>Factura: {pago.factura} • {pago.fecha}</p>
                        </div>
                        <div className="pago-metodo">
                            <span className="metodo-badge">{pago.metodo}</span>
                        </div>
                        <div className="pago-monto">
                            <span>Bs. {pago.monto}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
