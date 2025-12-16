import React, { useState } from 'react';
import { AlertTriangle, Plus, DollarSign } from 'lucide-react';
import './MultasPage.css';

export default function MultasPage() {
    const [multas, setMultas] = useState([
        { id: 1, reservaId: 101, motivo: 'Exceso de tiempo', monto: 50, estado: 'PENDIENTE', fecha: '2025-12-08' },
        { id: 2, reservaId: 102, motivo: 'Daño al espacio', monto: 200, estado: 'PAGADA', fecha: '2025-12-07' },
        { id: 3, reservaId: 103, motivo: 'Estacionamiento indebido', monto: 100, estado: 'PENDIENTE', fecha: '2025-12-09' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        reservaId: '',
        motivo: '',
        monto: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Multa creada para reserva #' + formData.reservaId);
        setShowModal(false);
        setFormData({ reservaId: '', motivo: '', monto: '' });
    };

    const handlePagar = (multaId) => {
        alert('Procesando pago de multa #' + multaId);
    };

    return (
        <div className="multas-page">
            <div className="multas-header">
                <div>
                    <h1>Gestión de Multas</h1>
                    <p>Administra multas y penalizaciones</p>
                </div>
                <button className="btn-nueva-multa" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Nueva Multa
                </button>
            </div>

            <div className="multas-stats">
                <div className="stat-card pendientes">
                    <div className="stat-icon">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Multas Pendientes</p>
                        <h3 className="stat-value">{multas.filter(m => m.estado === 'PENDIENTE').length}</h3>
                    </div>
                </div>
                <div className="stat-card total">
                    <div className="stat-icon">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="stat-label">Monto Total Pendiente</p>
                        <h3 className="stat-value">
                            Bs. {multas.filter(m => m.estado === 'PENDIENTE').reduce((sum, m) => sum + m.monto, 0)}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="multas-list">
                {multas.map(multa => (
                    <div key={multa.id} className="multa-card">
                        <div className="multa-icon">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="multa-info">
                            <h3>Multa #{multa.id}</h3>
                            <p className="motivo">{multa.motivo}</p>
                            <p className="reserva">Reserva #{multa.reservaId} • {multa.fecha}</p>
                        </div>
                        <div className="multa-monto">
                            <span className="monto">Bs. {multa.monto}</span>
                            <span className={`estado ${multa.estado.toLowerCase()}`}>
                                {multa.estado === 'PENDIENTE' ? 'Pendiente' : 'Pagada'}
                            </span>
                        </div>
                        {multa.estado === 'PENDIENTE' && (
                            <button onClick={() => handlePagar(multa.id)} className="btn-pagar">
                                Pagar
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nueva Multa</h2>
                            <button onClick={() => setShowModal(false)} className="btn-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>ID de Reserva</label>
                                <input
                                    type="number"
                                    value={formData.reservaId}
                                    onChange={(e) => setFormData({ ...formData, reservaId: e.target.value })}
                                    placeholder="101"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Motivo</label>
                                <select
                                    value={formData.motivo}
                                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar motivo</option>
                                    <option value="Exceso de tiempo">Exceso de tiempo</option>
                                    <option value="Daño al espacio">Daño al espacio</option>
                                    <option value="Estacionamiento indebido">Estacionamiento indebido</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Monto (Bs.)</label>
                                <input
                                    type="number"
                                    value={formData.monto}
                                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                    placeholder="50"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Multa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
