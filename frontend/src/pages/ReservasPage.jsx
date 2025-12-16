import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, Bike, Accessibility, Truck, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { sedesService } from '../services/sedesService';
import './ReservasPage.css';

const API_URL = 'http://localhost:8080';

export default function ReservasPage() {
    const [step, setStep] = useState(1);
    const [sedes, setSedes] = useState([]);
    const [espaciosDisponibles, setEspaciosDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        sedeId: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        tipoVehiculo: ''
    });

    const [selectedEspacio, setSelectedEspacio] = useState(null);

    useEffect(() => {
        loadSedes();
    }, []);

    const loadSedes = async () => {
        try {
            console.log('Cargando sedes...');
            const data = await sedesService.getSedes();
            console.log('Sedes cargadas:', data);
            setSedes(data);
            if (data.length === 0) {
                alert('No hay sedes disponibles. Por favor crea sedes primero desde el menú Sedes.');
            }
        } catch (error) {
            console.error('Error loading sedes:', error);
            alert('Error al cargar sedes: ' + error.message);
        }
    };

    const getTipoIcon = (tipo) => {
        const icons = { NORMAL: Car, MOTO: Bike, DISCAPACITADO: Accessibility, SUV: Truck };
        return icons[tipo] || Car;
    };

    const getTipoColor = (tipo) => {
        const colors = { NORMAL: '#667eea', MOTO: '#10b981', DISCAPACITADO: '#f59e0b', SUV: '#ef4444' };
        return colors[tipo] || '#667eea';
    };

    // Validación de fecha/hora
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        return maxDate.toISOString().split('T')[0];
    };

    const getMinTime = () => {
        const now = new Date();
        const selectedDate = new Date(formData.fecha);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
            return now.toTimeString().slice(0, 5);
        }
        return '00:00';
    };

    const buscarEspacios = async () => {
        if (!formData.sedeId || !formData.fecha || !formData.horaInicio || !formData.horaFin || !formData.tipoVehiculo) {
            alert('Por favor complete todos los campos');
            return;
        }

        // Validar que hora fin sea después de hora inicio
        if (formData.horaFin <= formData.horaInicio) {
            alert('La hora de fin debe ser posterior a la hora de inicio');
            return;
        }

        setLoading(true);
        try {
            // Buscar espacios disponibles de la sede
            const response = await fetch(`${API_URL}/espacios/sede/${formData.sedeId}`);
            const todosEspacios = await response.json();

            // Filtrar solo disponibles
            let disponibles = todosEspacios.filter(e => e.estado === 'DISPONIBLE');

            // Filtrar por compatibilidad con tipo de vehículo
            if (formData.tipoVehiculo === 'Moto') {
                // Motos solo pueden usar espacios MOTO
                disponibles = disponibles.filter(e => e.tipo === 'MOTO');
            } else if (formData.tipoVehiculo === 'Auto') {
                // Autos pueden usar AUTO, DISCAPACITADO y VIP (no MOTO)
                disponibles = disponibles.filter(e => e.tipo !== 'MOTO');
            }

            if (disponibles.length === 0) {
                alert(`No hay espacios disponibles para ${formData.tipoVehiculo} en esta sede y horario`);
            }

            setEspaciosDisponibles(disponibles);
            setStep(2);
        } catch (error) {
            console.error('Error buscando espacios:', error);
            alert('Error al buscar espacios disponibles');
        } finally {
            setLoading(false);
        }
    };

    const confirmarReserva = async () => {
        if (!selectedEspacio) {
            alert('Por favor seleccione un espacio');
            return;
        }

        try {
            // Obtener usuario del localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                alert('Error: Usuario no autenticado');
                return;
            }

            const reservaData = {
                usuarioId: parseInt(user.id),
                espacioId: parseInt(selectedEspacio.id),
                fechaInicio: `${formData.fecha}T${formData.horaInicio}:00`,
                fechaFin: `${formData.fecha}T${formData.horaFin}:00`,
                tipoVehiculo: formData.tipoVehiculo || 'Auto'
            };

            console.log('Enviando reserva:', reservaData);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/reservas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(reservaData)
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Reserva creada:', result);
                setStep(3);
            } else {
                // Intentar leer el error como JSON, si falla mostrar texto plano
                const contentType = response.headers.get('content-type');
                let errorMessage = `Error ${response.status}`;

                try {
                    if (contentType && contentType.includes('application/json')) {
                        const error = await response.json();
                        errorMessage = error.error || JSON.stringify(error);
                    } else {
                        const text = await response.text();
                        errorMessage = text || errorMessage;
                    }
                } catch (e) {
                    console.error('Error parseando respuesta:', e);
                }

                console.error('Error del servidor:', errorMessage);
                alert(`Error al crear la reserva: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error creando reserva:', error);
            alert(`Error al crear la reserva: ${error.message}`);
        }
    };

    const reiniciar = () => {
        setStep(1);
        setFormData({ sedeId: '', fecha: '', horaInicio: '', horaFin: '', tipoVehiculo: '' });
        setSelectedEspacio(null);
        setEspaciosDisponibles([]);
    };

    return (
        <div className="reservas-page">
            <div className="reservas-header">
                <h1>Nueva Reserva</h1>
                <p>Reserva tu espacio de estacionamiento</p>
            </div>

            <div className="reservas-steps">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Fecha y Hora</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Seleccionar Espacio</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Confirmación</span>
                </div>
            </div>

            {step === 1 && (
                <div className="reserva-form-card">
                    <h2>Selecciona Fecha, Hora y Sede</h2>

                    <div className="form-group">
                        <label><MapPin size={18} /> Sede</label>
                        <select
                            value={formData.sedeId}
                            onChange={(e) => setFormData({ ...formData, sedeId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar sede</option>
                            {sedes.length === 0 && (
                                <option value="" disabled>No hay sedes disponibles</option>
                            )}
                            {sedes.map(sede => (
                                <option key={sede.id} value={sede.id}>{sede.nombre} - {sede.ciudad}</option>
                            ))}
                        </select>
                        {sedes.length === 0 && (
                            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                No hay sedes. Ve a "Sedes" para crear una.
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label><Calendar size={18} /> Fecha</label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            min={getMinDate()}
                            max={getMaxDate()}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Car size={18} /> Tipo de Vehículo</label>
                        <select
                            value={formData.tipoVehiculo}
                            onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="Auto">Auto</option>
                            <option value="Moto">Moto</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><Clock size={18} /> Hora Inicio</label>
                            <input
                                type="time"
                                value={formData.horaInicio}
                                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                                min={formData.fecha === getMinDate() ? getMinTime() : '00:00'}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Clock size={18} /> Hora Fin</label>
                            <input
                                type="time"
                                value={formData.horaFin}
                                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button onClick={buscarEspacios} className="btn-buscar" disabled={loading}>
                        {loading ? 'Buscando...' : 'Buscar Espacios Disponibles'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="espacios-disponibles">
                    <h2>Espacios Disponibles ({espaciosDisponibles.length})</h2>
                    <p className="subtitle">Selecciona el espacio que deseas reservar</p>

                    <div className="espacios-grid">
                        {espaciosDisponibles.map(espacio => {
                            const Icon = getTipoIcon(espacio.tipo);
                            const color = getTipoColor(espacio.tipo);
                            const isSelected = selectedEspacio?.id === espacio.id;

                            return (
                                <div
                                    key={espacio.id}
                                    className={`espacio-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedEspacio(espacio)}
                                    style={{ borderColor: isSelected ? color : '#e2e8f0' }}
                                >
                                    <div className="espacio-icon" style={{ backgroundColor: `${color}15`, color }}>
                                        <Icon size={28} />
                                    </div>
                                    <h3>Espacio {espacio.numero}</h3>
                                    <p className="espacio-tipo">{espacio.tipo}</p>
                                    <div className="espacio-tarifa">
                                        <DollarSign size={16} />
                                        <span>Bs. 10/hora</span>
                                    </div>
                                    {isSelected && (
                                        <div className="selected-badge">
                                            <CheckCircle size={20} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="form-actions">
                        <button onClick={() => setStep(1)} className="btn-secondary">
                            Volver
                        </button>
                        <button onClick={confirmarReserva} className="btn-primary" disabled={!selectedEspacio}>
                            Confirmar Reserva
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="confirmacion-card">
                    <div className="success-icon">
                        <CheckCircle size={64} />
                    </div>
                    <h2>¡Reserva Creada!</h2>
                    <p>Tu reserva ha sido enviada y está pendiente de aprobación por el operador.</p>
                    <div className="reserva-detalles">
                        <div className="detalle-item">
                            <span>Espacio:</span>
                            <strong>{selectedEspacio?.numero}</strong>
                        </div>
                        <div className="detalle-item">
                            <span>Tipo:</span>
                            <strong>{selectedEspacio?.tipo}</strong>
                        </div>
                        <div className="detalle-item">
                            <span>Fecha:</span>
                            <strong>{formData.fecha}</strong>
                        </div>
                        <div className="detalle-item">
                            <span>Horario:</span>
                            <strong>{formData.horaInicio} - {formData.horaFin}</strong>
                        </div>
                        <div className="detalle-item">
                            <span>Estado:</span>
                            <strong className="estado-pendiente">PENDIENTE DE APROBACIÓN</strong>
                        </div>
                    </div>
                    <button onClick={reiniciar} className="btn-primary">
                        Nueva Reserva
                    </button>
                </div>
            )}
        </div>
    );
}
