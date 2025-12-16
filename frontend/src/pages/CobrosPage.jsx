import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DollarSign, Calculator, Receipt, Clock, AlertTriangle } from 'lucide-react';
import './CobrosPage.css';

const API_URL = 'http://localhost:8080';

export default function CobrosPage() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        tipoVehiculo: 'Auto',
        minutos: '',
        conMulta: false
    });
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar datos del checkout si vienen desde ScannerPage
    useEffect(() => {
        if (location.state?.checkoutData) {
            const {
                tiempoMinutos,
                minutosReservados,
                minutosExcedidos,
                tipoVehiculo,
                montoCobrado,
                exentoMembresia,
                reservaId,
                facturaId
            } = location.state.checkoutData;

            // Construir detalle completo
            let detalle = `📋 Reserva #${reservaId}\n`;
            detalle += `🚗 Tipo: ${tipoVehiculo}\n`;
            detalle += `⏱️ Reservado: ${minutosReservados} min\n`;
            detalle += `⏰ Usado: ${tiempoMinutos} min`;

            if (minutosExcedidos > 0) {
                detalle += `\n⚠️ Excedido: ${minutosExcedidos} min (MULTA)`;
            }

            // Si viene exento por membresía
            if (exentoMembresia) {
                setResultado({
                    montoTotal: 0,
                    detalle: detalle + "\n\n✅ EXENTO POR MEMBRESÍA",
                    exentoMembresia: true
                });
            } else {
                // Mostrar el cobro ya calculado
                setResultado({
                    montoTotal: montoCobrado,
                    detalle: detalle,
                    facturaId: facturaId,
                    minutosExcedidos: minutosExcedidos
                });
            }

            // Pre-llenar el formulario
            setFormData({
                tipoVehiculo: tipoVehiculo || 'Auto',
                minutos: tiempoMinutos.toString(),
                conMulta: minutosExcedidos > 0
            });
        }
    }, [location.state]);

    const handleCalcular = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/cobros/calcular`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipoVehiculo: formData.tipoVehiculo,
                    minutos: parseInt(formData.minutos),
                    conMulta: formData.conMulta
                })
            });

            if (response.ok) {
                const data = await response.json();
                setResultado(data);
            } else {
                alert('Error al calcular el cobro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const limpiar = () => {
        setFormData({ tipoVehiculo: 'Auto', minutos: '', conMulta: false });
        setResultado(null);
    };

    return (
        <div className="cobros-page">
            <div className="cobros-header">
                <h1>💰 Módulo de Cobros</h1>
                <p>Cálculo de tarifas y generación de cobros</p>
            </div>

            <div className="cobros-container">
                <div className="cobros-form-card">
                    <h2><Calculator size={24} /> Calcular Cobro</h2>

                    <form onSubmit={handleCalcular}>
                        <div className="form-group">
                            <label>Tipo de Vehículo</label>
                            <select
                                value={formData.tipoVehiculo}
                                onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
                                required
                            >
                                <option value="Auto">Auto</option>
                                <option value="Moto">Moto</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label><Clock size={18} /> Minutos Estacionado</label>
                            <input
                                type="number"
                                value={formData.minutos}
                                onChange={(e) => setFormData({ ...formData, minutos: e.target.value })}
                                placeholder="Ej: 120"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.conMulta}
                                    onChange={(e) => setFormData({ ...formData, conMulta: e.target.checked })}
                                />
                                <span>Aplicar multa por exceso de tiempo</span>
                            </label>
                        </div>

                        <button type="submit" className="btn-calculate" disabled={loading}>
                            {loading ? 'Calculando...' : '🧮 Calcular Monto'}
                        </button>
                    </form>
                </div>

                {resultado && (
                    <div className="resultado-card">
                        <h2><Receipt size={24} /> Resultado del Cobro</h2>

                        <div className="result-details">
                            <div className="result-item">
                                <span className="label">Tipo:</span>
                                <span className="value">{formData.tipoVehiculo}</span>
                            </div>
                            <div className="result-item">
                                <span className="label">Minutos:</span>
                                <span className="value">{formData.minutos} min</span>
                            </div>
                            <div className="result-item">
                                <span className="label">Detalle:</span>
                                <span className="value" style={{ fontSize: '0.85rem', whiteSpace: 'pre-line' }}>
                                    {resultado.detalle}
                                </span>
                            </div>
                            {resultado.minutosExcedidos > 0 && (
                                <div className="result-item" style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                                    <AlertTriangle size={18} color="#f59e0b" />
                                    <span className="value" style={{ color: '#92400e' }}>
                                        Multa aplicada por {resultado.minutosExcedidos} minutos excedidos
                                    </span>
                                </div>
                            )}
                            {resultado.facturaId && (
                                <div className="result-item">
                                    <span className="label">📄 Factura:</span>
                                    <span className="value">#{resultado.facturaId}</span>
                                </div>
                            )}
                            {resultado.exentoMembresia ? (
                                <div className="result-item total" style={{ background: '#10b981', color: 'white' }}>
                                    <span className="label">Estado:</span>
                                    <span className="value">🎫 EXENTO POR MEMBRESÍA</span>
                                </div>
                            ) : (
                                <div className="result-item total">
                                    <span className="label">💵 Total a Cobrar:</span>
                                    <span className="value">Bs. {resultado.montoTotal?.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <button onClick={limpiar} className="btn-generate">
                            🔄 Limpiar / Nuevo Cálculo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
