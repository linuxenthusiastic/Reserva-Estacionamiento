import React, { useState } from 'react';
import { Tag, Plus, Percent, Calendar } from 'lucide-react';
import './DescuentosPage.css';

export default function DescuentosPage() {
    const [descuentos, setDescuentos] = useState([
        { id: 1, nombre: 'Descuento Estudiante', porcentaje: 15, codigo: 'EST15', activo: true },
        { id: 2, nombre: 'Promo Fin de Semana', porcentaje: 20, codigo: 'WEEKEND20', activo: true },
        { id: 3, nombre: 'Black Friday', porcentaje: 30, codigo: 'BF30', activo: false },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        porcentaje: '',
        codigo: '',
        fechaInicio: '',
        fechaFin: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Descuento creado: ' + formData.nombre);
        setShowModal(false);
        setFormData({ nombre: '', porcentaje: '', codigo: '', fechaInicio: '', fechaFin: '' });
    };

    return (
        <div className="descuentos-page">
            <div className="descuentos-header">
                <div>
                    <h1>Descuentos y Promociones</h1>
                    <p>Gestiona códigos de descuento y ofertas especiales</p>
                </div>
                <button className="btn-nuevo-descuento" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    Nuevo Descuento
                </button>
            </div>

            <div className="descuentos-grid">
                {descuentos.map(descuento => (
                    <div key={descuento.id} className="descuento-card">
                        <div className="descuento-header">
                            <div className="descuento-icon">
                                <Tag size={24} />
                            </div>
                            <span className={`descuento-estado ${descuento.activo ? 'activo' : 'inactivo'}`}>
                                {descuento.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        <h3>{descuento.nombre}</h3>

                        <div className="descuento-porcentaje">
                            <Percent size={32} />
                            <span className="porcentaje-valor">{descuento.porcentaje}%</span>
                        </div>

                        <div className="descuento-codigo">
                            <span className="codigo-label">Código:</span>
                            <span className="codigo-valor">{descuento.codigo}</span>
                        </div>

                        <div className="descuento-actions">
                            <button className="btn-editar">Editar</button>
                            <button className="btn-toggle">
                                {descuento.activo ? 'Desactivar' : 'Activar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nuevo Descuento</h2>
                            <button onClick={() => setShowModal(false)} className="btn-close">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Nombre del Descuento</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: Descuento Estudiante"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Porcentaje (%)</label>
                                <input
                                    type="number"
                                    value={formData.porcentaje}
                                    onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                                    placeholder="15"
                                    min="1"
                                    max="100"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Código</label>
                                <input
                                    type="text"
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                                    placeholder="EST15"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fecha Fin</label>
                                    <input
                                        type="date"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Descuento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
