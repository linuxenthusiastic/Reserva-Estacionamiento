import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './GestionReservasPage.css';

const API_URL = 'http://localhost:8080';

export default function GestionReservasPage() {
    const [reservasPendientes, setReservasPendientes] = useState([]);
    const [todasReservas, setTodasReservas] = useState([]);
    const [vistaActual, setVistaActual] = useState('pendientes'); // 'pendientes' o 'todas'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarReservas();
        // Auto-refresh cada 10 segundos
        const interval = setInterval(cargarReservas, 10000);
        return () => clearInterval(interval);
    }, []);

    const cargarReservas = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            // Cargar reservas pendientes
            const resPendientes = await fetch(`${API_URL}/api/reservas/pendientes`, { headers });
            if (resPendientes.ok) {
                const dataPendientes = await resPendientes.json();
                setReservasPendientes(dataPendientes);
            }

            // Cargar todas las reservas
            const resTodas = await fetch(`${API_URL}/api/reservas`, { headers });
            if (resTodas.ok) {
                const dataTodas = await resTodas.json();
                setTodasReservas(dataTodas);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const aprobarReserva = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/reservas/${id}/aprobar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                alert('Reserva aprobada exitosamente');
                cargarReservas();
            } else {
                alert('Error al aprobar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al aprobar la reserva');
        }
    };

    const rechazarReserva = async (id) => {
        if (!confirm('¿Estás seguro de rechazar esta reserva?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/reservas/${id}/rechazar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (response.ok) {
                alert('Reserva rechazada');
                cargarReservas();
            } else {
                alert('Error al rechazar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al rechazar la reserva');
        }
    };

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatearHora = (fechaStr) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'PENDIENTE': { class: 'badge-pendiente', text: 'Pendiente' },
            'CONFIRMADA': { class: 'badge-confirmada', text: 'Confirmada' },
            'RECHAZADA': { class: 'badge-rechazada', text: 'Rechazada' },
            'CANCELADA': { class: 'badge-cancelada', text: 'Cancelada' },
            'EN_USO': { class: 'badge-en-uso', text: 'En Uso' },
            'COMPLETADA': { class: 'badge-completada', text: 'Completada' }
        };
        const badge = badges[estado] || badges['PENDIENTE'];
        return <span className={`estado-badge ${badge.class}`}>{badge.text}</span>;
    };

    const reservasAMostrar = vistaActual === 'pendientes' ? reservasPendientes : todasReservas;

    if (loading) {
        return <div className="gestion-container"><div className="loading">Cargando...</div></div>;
    }

    return (
        <div className="gestion-container">
            <div className="page-header">
                <h1>Gestión de Reservas</h1>
                <p>Aprobar o rechazar solicitudes de reserva</p>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${vistaActual === 'pendientes' ? 'active' : ''}`}
                    onClick={() => setVistaActual('pendientes')}
                >
                    <AlertCircle size={20} />
                    Pendientes ({reservasPendientes.length})
                </button>
                <button
                    className={`tab ${vistaActual === 'todas' ? 'active' : ''}`}
                    onClick={() => setVistaActual('todas')}
                >
                    <Calendar size={20} />
                    Todas ({todasReservas.length})
                </button>
            </div>

            {reservasAMostrar.length === 0 ? (
                <div className="empty-state">
                    <Calendar size={64} />
                    <h3>No hay reservas {vistaActual === 'pendientes' ? 'pendientes' : ''}</h3>
                </div>
            ) : (
                <div className="reservas-grid">
                    {reservasAMostrar.map((reserva) => (
                        <div key={reserva.id} className="reserva-card">
                            <div className="card-header">
                                <div className="reserva-id">Reserva #{reserva.id}</div>
                                {getEstadoBadge(reserva.estado)}
                            </div>

                            <div className="card-body">
                                <div className="info-row">
                                    <User size={20} />
                                    <div>
                                        <div className="label">Usuario</div>
                                        <div className="value">ID: {reserva.usuarioId}</div>
                                    </div>
                                </div>

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

                                {reserva.estado === 'PENDIENTE' && (
                                    <div className="actions">
                                        <button
                                            className="btn-aprobar"
                                            onClick={() => aprobarReserva(reserva.id)}
                                        >
                                            <CheckCircle size={18} />
                                            Aprobar
                                        </button>
                                        <button
                                            className="btn-rechazar"
                                            onClick={() => rechazarReserva(reserva.id)}
                                        >
                                            <XCircle size={18} />
                                            Rechazar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
