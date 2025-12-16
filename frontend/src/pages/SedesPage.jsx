import React, { useState, useEffect } from 'react';
import { sedesService } from '../services/sedesService';
import { MapPin, Plus, Edit2, Trash2, Clock, Users } from 'lucide-react';
import './SedesPage.css';

export default function SedesPage() {
    const [sedes, setSedes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSede, setEditingSede] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        ciudad: ''
    });

    useEffect(() => {
        loadSedes();
    }, []);

    const loadSedes = async () => {
        try {
            const data = await sedesService.getSedes();
            setSedes(data);
        } catch (error) {
            console.error('Error loading sedes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSede) {
                await sedesService.updateSede(editingSede.id, formData);
            } else {
                await sedesService.createSede(formData);
            }
            loadSedes();
            closeModal();
        } catch (error) {
            console.error('Error saving sede:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta sede?')) {
            try {
                await sedesService.deleteSede(id);
                loadSedes();
            } catch (error) {
                console.error('Error deleting sede:', error);
            }
        }
    };

    const openModal = (sede = null) => {
        if (sede) {
            setEditingSede(sede);
            setFormData({
                nombre: sede.nombre,
                direccion: sede.direccion,
                ciudad: sede.ciudad
            });
        } else {
            setEditingSede(null);
            setFormData({ nombre: '', direccion: '', ciudad: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSede(null);
        setFormData({ nombre: '', direccion: '', ciudad: '' });
    };

    if (loading) {
        return (
            <div className="sedes-loading">
                <div className="spinner"></div>
                <p>Cargando sedes...</p>
            </div>
        );
    }

    return (
        <div className="sedes-page">
            <div className="sedes-header">
                <div>
                    <h1>Gestión de Sedes</h1>
                    <p>Administra las ubicaciones de estacionamiento</p>
                </div>
                <button className="btn-add" onClick={() => openModal()}>
                    <Plus size={20} />
                    Nueva Sede
                </button>
            </div>

            <div className="sedes-grid">
                {sedes.map(sede => (
                    <div key={sede.id} className="sede-card">
                        <div className="sede-card-header">
                            <div className="sede-icon">
                                <MapPin size={24} />
                            </div>
                            <div className="sede-actions">
                                <button onClick={() => openModal(sede)} className="btn-icon">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(sede.id)} className="btn-icon btn-danger">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="sede-content">
                            <h3>{sede.nombre}</h3>
                            <div className="sede-info">
                                <div className="info-item">
                                    <MapPin size={16} />
                                    <span>{sede.direccion}</span>
                                </div>
                                <div className="info-item">
                                    <Users size={16} />
                                    <span>{sede.ciudad}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sede-footer">
                            <button className="btn-view">Ver Espacios</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingSede ? 'Editar Sede' : 'Nueva Sede'}</h2>
                            <button onClick={closeModal} className="btn-close">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Nombre de la Sede</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: Sede Centro"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type="text"
                                    value={formData.direccion}
                                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                    placeholder="Ej: Av. Principal 123"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ciudad</label>
                                <input
                                    type="text"
                                    value={formData.ciudad}
                                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                                    placeholder="Ej: La Paz"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingSede ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
