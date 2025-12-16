import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Car, Bike, Accessibility, Truck } from 'lucide-react';
import './TarifasPage.css';

const API_URL = 'http://localhost:8080';

export default function TarifasPage() {
    const [tarifas, setTarifas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTarifa, setEditingTarifa] = useState(null);
    const [formData, setFormData] = useState({
        tipoEspacio: 'NORMAL',
        precioPorHora: '',
        descripcion: ''
    });

    useEffect(() => {
        loadTarifas();
    }, []);

    const loadTarifas = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tarifas`);
            const data = await response.json();
            setTarifas(data);
        } catch (error) {
            console.error('Error loading tarifas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingTarifa
                ? `${API_URL}/api/tarifas/${editingTarifa.id}`
                : `${API_URL}/api/tarifas`;

            const method = editingTarifa ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            loadTarifas();
            closeModal();
        } catch (error) {
            console.error('Error saving tarifa:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta tarifa?')) {
            try {
                await fetch(`${API_URL}/api/tarifas/${id}`, { method: 'DELETE' });
                loadTarifas();
            } catch (error) {
                console.error('Error deleting tarifa:', error);
            }
        }
    };

    const openModal = (tarifa = null) => {
        if (tarifa) {
            setEditingTarifa(tarifa);
            setFormData({
                tipoEspacio: tarifa.tipoEspacio,
                precioPorHora: tarifa.precioPorHora,
                descripcion: tarifa.descripcion || ''
            });
        } else {
            setEditingTarifa(null);
            setFormData({ tipoEspacio: 'NORMAL', precioPorHora: '', descripcion: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTarifa(null);
        setFormData({ tipoEspacio: 'NORMAL', precioPorHora: '', descripcion: '' });
    };

    const getTipoIcon = (tipo) => {
        const icons = {
            NORMAL: Car,
            MOTO: Bike,
            DISCAPACITADO: Accessibility,
            SUV: Truck
        };
        return icons[tipo] || Car;
    };

    const getTipoColor = (tipo) => {
        const colors = {
            NORMAL: '#667eea',
            MOTO: '#10b981',
            DISCAPACITADO: '#f59e0b',
            SUV: '#ef4444'
        };
        return colors[tipo] || '#667eea';
    };

    if (loading) {
        return (
            <div className="tarifas-loading">
                <div className="spinner"></div>
                <p>Cargando tarifas...</p>
            </div>
        );
    }

    return (
        <div className="tarifas-page">
            <div className="tarifas-header">
                <div>
                    <h1>Gestión de Tarifas</h1>
                    <p>Administra los precios por tipo de espacio</p>
                </div>
                <button className="btn-add" onClick={() => openModal()}>
                    <Plus size={20} />
                    Nueva Tarifa
                </button>
            </div>

            <div className="tarifas-grid">
                {tarifas.map(tarifa => {
                    const Icon = getTipoIcon(tarifa.tipoEspacio);
                    const color = getTipoColor(tarifa.tipoEspacio);

                    return (
                        <div key={tarifa.id} className="tarifa-card" style={{ borderTopColor: color }}>
                            <div className="tarifa-icon" style={{ backgroundColor: `${color}15`, color }}>
                                <Icon size={32} />
                            </div>
                            <h3>{tarifa.tipoEspacio}</h3>
                            <div className="tarifa-price">
                                <span className="currency">Bs.</span>
                                <span className="amount">{tarifa.precioPorHora}</span>
                                <span className="period">/hora</span>
                            </div>
                            {tarifa.descripcion && (
                                <p className="tarifa-description">{tarifa.descripcion}</p>
                            )}
                            <div className="tarifa-actions">
                                <button onClick={() => openModal(tarifa)} className="btn-icon">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(tarifa.id)} className="btn-icon btn-danger">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTarifa ? 'Editar Tarifa' : 'Nueva Tarifa'}</h2>
                            <button onClick={closeModal} className="btn-close">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Tipo de Espacio</label>
                                <select
                                    value={formData.tipoEspacio}
                                    onChange={(e) => setFormData({ ...formData, tipoEspacio: e.target.value })}
                                    required
                                >
                                    <option value="NORMAL">Normal</option>
                                    <option value="MOTO">Moto</option>
                                    <option value="DISCAPACITADO">Discapacitado</option>
                                    <option value="SUV">SUV</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Precio por Hora (Bs.)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioPorHora}
                                    onChange={(e) => setFormData({ ...formData, precioPorHora: e.target.value })}
                                    placeholder="10.00"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción (opcional)</label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Descripción de la tarifa..."
                                    rows="3"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingTarifa ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
