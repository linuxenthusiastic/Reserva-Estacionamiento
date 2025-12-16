import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, XCircle, Edit2, Trash2, X } from 'lucide-react';
import './MisReservasPage.css';

const API_URL = 'http://localhost:8080';

export default function MisReservasPage() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalEditar, setModalEditar] = useState(null);
    const [formEditar, setFormEditar] = useState({ fechaInicio: '', horaInicio: '', horaFin: '' });

    useEffect(() => {
        cargarReservas();
        const interval = setInterval(cargarReservas, 5000);
        return () => clearInterval(interval);
    }, []);

    const cargarReservas = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                alert('Error: Usuario no autenticado');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/reservas/usuario/${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReservas(data);
            } else {
                console.error('Error al cargar reservas');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (reservaId) => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                alert('Reserva cancelada exitosamente');
                cargarReservas();
            } else {
                const error = await response.json();
                alert('Error: ' + (error.error || 'No se pudo cancelar la reserva'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cancelar la reserva');
        }
    };

    const abrirModalEditar = (reserva) => {
        const fechaInicio = new Date(reserva.fechaInicio);
        const fechaFin = new Date(reserva.fechaFin);

        setFormEditar({
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            horaInicio: fechaInicio.toTimeString().slice(0, 5),
            horaFin: fechaFin.toTimeString().slice(0, 5)
        });
        setModalEditar(reserva);
    };

    const handleEditar = async () => {
        try {
            const fechaInicio = `${formEditar.fechaInicio}T${formEditar.horaInicio}:00`;
            const fechaFin = `${formEditar.fechaInicio}T${formEditar.horaFin}:00`;

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/reservas/${modalEditar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ fechaInicio, fechaFin })
            });

            if (response.ok) {
                alert('Reserva editada exitosamente');
                setModalEditar(null);
                cargarReservas();
            } else {
                const error = await response.json();
                alert('Error: ' + (error.error || 'No se pudo editar la reserva'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al editar la reserva');
        }
    };

    const puedeEditarOCancelar = (estado) => {
        return estado === 'PENDIENTE' || estado === 'CONFIRMADA';
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'PENDIENTE': { icon: AlertCircle, class: 'badge-pendiente', text: 'Pendiente de Aprobación' },
            'CONFIRMADA': { icon: CheckCircle, class: 'badge-confirmada', text: 'Confirmada' },
            'RECHAZADA': { icon: XCircle, class: 'badge-cancelada', text: 'Rechazada' },
            'EN_USO': { icon: CheckCircle, class: 'badge-en-uso', text: 'En Uso' },
            'COMPLETADA': { icon: CheckCircle, class: 'badge-completada', text: 'Completada' },
            'CANCELADA': { icon: XCircle, class: 'badge-cancelada', text: 'Cancelada' }
        };

        const badge = badges[estado] || badges['PENDIENTE'];
        const Icon = badge.icon;

        return (
            <span className={`estado-badge ${badge.class}`}>
                <Icon size={16} />
                {badge.text}
            </span>
        );
    };

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="mis-reservas-container">
                <div className="loading">Cargando reservas...</div>
            </div>
        );
    }

    return (
        <div className="mis-reservas-container">
            <div className="page-header">
                <h1>Mis Reservas</h1>
                <p>Historial de tus reservas de estacionamiento</p>
            </div>

            {reservas.length === 0 ? (
                <div className="empty-state">
                    <Calendar size={64} />
                    <h3>No tienes reservas</h3>
                    <p>Crea tu primera reserva para verla aquí</p>
                </div>
            ) : (
                <div className="reservas-grid">
                    {reservas.map((reserva) => (
                        <div key={reserva.id} className="reserva-card">
                            <div className="card-header">
                                <div className="reserva-id">Reserva #{reserva.id}</div>
                                {getEstadoBadge(reserva.estado)}
                            </div>

                            <div className="card-body">
                                <div className="info-row">
                                    <MapPin size={20} />
                                    <div>
                                        <div className="label">Espacio</div>
                                        <div className="value">Espacio #{reserva.espacioId}</div>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <Calendar size={20} />
                                    <div>
                                        <div className="label">Fecha</div>
                                        <div className="value">{formatearFecha(reserva.fechaInicio)}</div>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <Clock size={20} />
                                    <div>
                                        <div className="label">Horario</div>
                                        <div className="value">
                                            {formatearHora(reserva.fechaInicio)} - {formatearHora(reserva.fechaFin)}
                                        </div>
                                    </div>
                                </div>

                                {reserva.qrCode && (
                                    <div className="qr-section">
                                        <div className="label">Código QR</div>
                                        <div className="qr-code">{reserva.qrCode}</div>
                                    </div>
                                )}

                                {puedeEditarOCancelar(reserva.estado) && (
                                    <div className="card-actions">
                                        <button
                                            className="btn-editar"
                                            onClick={() => abrirModalEditar(reserva)}
                                        >
                                            <Edit2 size={16} />
                                            Editar
                                        </button>
                                        <button
                                            className="btn-cancelar"
                                            onClick={() => handleCancelar(reserva.id)}
                                        >
                                            <Trash2 size={16} />
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalEditar && (
                <div className="modal-overlay" onClick={() => setModalEditar(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Editar Reserva #{modalEditar.id}</h2>
                            <button className="btn-close" onClick={() => setModalEditar(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    value={formEditar.fechaInicio}
                                    onChange={(e) => setFormEditar({ ...formEditar, fechaInicio: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hora Inicio</label>
                                    <input
                                        type="time"
                                        value={formEditar.horaInicio}
                                        onChange={(e) => setFormEditar({ ...formEditar, horaInicio: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Hora Fin</label>
                                    <input
                                        type="time"
                                        value={formEditar.horaFin}
                                        onChange={(e) => setFormEditar({ ...formEditar, horaFin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setModalEditar(null)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleEditar}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
