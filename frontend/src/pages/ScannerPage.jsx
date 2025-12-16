import React, { useState } from 'react';
import { QrCode, LogIn, LogOut, CheckCircle, XCircle, Loader, AlertCircle, Receipt, AlertTriangle } from 'lucide-react';
import './ScannerPage.css';

const API_URL = 'http://localhost:8080';

export default function ScannerPage() {
    const [codigoQR, setCodigoQR] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const [checkoutInfo, setCheckoutInfo] = useState(null);

    const validarCodigo = (codigo) => {
        const trimmed = codigo.trim().toUpperCase();
        return /^[A-Z0-9]{8}$/.test(trimmed) ? trimmed : null;
    };

    const handleCheckIn = async () => {
        const codigo = validarCodigo(codigoQR);

        if (!codigo) {
            setStatus({ type: 'error', msg: 'Código inválido. Debe tener 8 caracteres alfanuméricos' });
            return;
        }

        setLoading(true);
        setCheckoutInfo(null);
        try {
            const response = await fetch(API_URL + '/api/acceso/validar-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoQR: codigo })
            });

            if (response.ok) {
                const data = await response.json();

                // Validar que los datos existan
                if (!data.reservaId || !data.espacioId) {
                    setStatus({
                        type: 'error',
                        msg: `✗ ERROR\nNo se encontró reserva con el código: ${codigo}`
                    });
                    setCodigoQR('');
                    return;
                }

                setStatus({
                    type: 'success',
                    msg: `✓ ENTRADA REGISTRADA\nReserva #${data.reservaId}\nEspacio: ${data.espacioId}\nCódigo: ${codigo}`
                });
                setCodigoQR('');
            } else {
                const errorText = await response.text();
                setStatus({ type: 'error', msg: `✗ ERROR\n${errorText || 'Código QR inválido'}` });
                setCodigoQR('');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({ type: 'error', msg: '✗ Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        const codigo = validarCodigo(codigoQR);

        if (!codigo) {
            setStatus({ type: 'error', msg: 'Código inválido. Debe tener 8 caracteres alfanuméricos' });
            return;
        }

        setLoading(true);
        setCheckoutInfo(null);
        try {
            const buscarResponse = await fetch(API_URL + '/api/acceso/buscar-por-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoQR: codigo })
            });

            if (!buscarResponse.ok) {
                setStatus({ type: 'error', msg: '✗ Código QR no encontrado' });
                setLoading(false);
                return;
            }

            const reservaData = await buscarResponse.json();
            const reservaId = reservaData.reservaId || reservaData.id;

            const checkoutResponse = await fetch(API_URL + '/api/acceso/check-out/' + reservaId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (checkoutResponse.ok) {
                const data = await checkoutResponse.json();

                setStatus({
                    type: 'success',
                    msg: `✓ SALIDA REGISTRADA - Reserva #${reservaId}`
                });

                // Guardar información del checkout para mostrar
                setCheckoutInfo({
                    reservaId: reservaId,
                    tiempoMinutos: data.tiempoTotalMinutos,
                    minutosReservados: data.minutosReservados,
                    minutosExcedidos: data.minutosExcedidos,
                    tipoVehiculo: data.tipoVehiculo,
                    montoCobrado: data.montoCobrado,
                    facturaId: data.facturaId,
                    exentoMembresia: data.exentoMembresia
                });

                setCodigoQR('');
            } else {
                const errorText = await checkoutResponse.text();
                setStatus({ type: 'error', msg: `✗ Error: ${errorText}` });
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({ type: 'error', msg: '✗ Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    const limpiarCheckout = () => {
        setCheckoutInfo(null);
        setStatus({ type: '', msg: '' });
    };

    return (
        <div className="scanner-page">
            <div className="scanner-header">
                <QrCode size={48} />
                <h1>Check-In / Check-Out</h1>
                <p>Escanea el código QR de la reserva</p>
            </div>

            <div className="scanner-container">
                <div className="scanner-input-section">
                    <div className="input-group">
                        <label>
                            <QrCode size={20} />
                            Código QR (8 caracteres)
                        </label>
                        <input
                            type="text"
                            value={codigoQR}
                            onChange={(e) => setCodigoQR(e.target.value.toUpperCase())}
                            placeholder="Ej: A1B2C3D4"
                            maxLength={8}
                            disabled={loading}
                        />
                        <small>Ingresa el código alfanumérico de 8 caracteres</small>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={handleCheckIn}
                            className="btn-checkin"
                            disabled={loading || !codigoQR}
                        >
                            {loading ? <Loader className="spin" size={20} /> : <LogIn size={20} />}
                            CHECK-IN
                        </button>

                        <button
                            onClick={handleCheckOut}
                            className="btn-checkout"
                            disabled={loading || !codigoQR}
                        >
                            {loading ? <Loader className="spin" size={20} /> : <LogOut size={20} />}
                            CHECK-OUT
                        </button>
                    </div>

                    {status.msg && (
                        <div className={`status-message ${status.type}`}>
                            {status.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                            <span>{status.msg}</span>
                        </div>
                    )}
                </div>

                {checkoutInfo && (
                    <div className="checkout-details-card">
                        <div className="checkout-header">
                            <Receipt size={24} />
                            <h2>Detalle del Cobro</h2>
                            <button className="btn-close-details" onClick={limpiarCheckout}>
                                ✕
                            </button>
                        </div>

                        <div className="checkout-info">
                            <div className="info-row">
                                <span className="label">📋 Reserva:</span>
                                <span className="value">#{checkoutInfo.reservaId}</span>
                            </div>

                            <div className="info-row">
                                <span className="label">🚗 Tipo de Vehículo:</span>
                                <span className="value">{checkoutInfo.tipoVehiculo}</span>
                            </div>

                            <div className="info-row">
                                <span className="label">🎫 Membresía:</span>
                                <span className="value" style={{ color: checkoutInfo.exentoMembresia ? '#10b981' : '#666' }}>
                                    {checkoutInfo.exentoMembresia ? '✅ ACTIVA (Exento de pago)' : '❌ No tiene membresía'}
                                </span>
                            </div>

                            <div className="info-row">
                                <span className="label">⏱️ Tiempo Reservado:</span>
                                <span className="value">{checkoutInfo.minutosReservados} minutos</span>
                            </div>

                            <div className="info-row">
                                <span className="label">⏰ Tiempo Usado:</span>
                                <span className="value">{checkoutInfo.tiempoMinutos} minutos</span>
                            </div>

                            {checkoutInfo.minutosExcedidos > 0 && (
                                <div className="info-row warning">
                                    <AlertTriangle size={18} />
                                    <span className="label">⚠️ Tiempo Excedido:</span>
                                    <span className="value">{checkoutInfo.minutosExcedidos} min (MULTA APLICADA)</span>
                                </div>
                            )}

                            {checkoutInfo.exentoMembresia ? (
                                <div className="info-row exento">
                                    <span className="label">Estado:</span>
                                    <span className="value">🎫 EXENTO POR MEMBRESÍA</span>
                                </div>
                            ) : (
                                <>
                                    <div className="info-row total">
                                        <span className="label">💵 Monto Total:</span>
                                        <span className="value">Bs. {checkoutInfo.montoCobrado?.toFixed(2)}</span>
                                    </div>
                                    {checkoutInfo.facturaId && (
                                        <div className="info-row">
                                            <span className="label">📄 Factura:</span>
                                            <span className="value">#{checkoutInfo.facturaId}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="checkout-actions">
                            {checkoutInfo.facturaId && !checkoutInfo.exentoMembresia && (
                                <button
                                    className="btn-ver-factura"
                                    onClick={() => window.open(`/facturacion?id=${checkoutInfo.facturaId}`, '_blank')}
                                >
                                    📄 Ver Factura #{checkoutInfo.facturaId}
                                </button>
                            )}
                            <button className="btn-nueva-operacion" onClick={limpiarCheckout}>
                                🔄 Nueva Operación
                            </button>
                        </div>
                    </div>
                )}

                <div className="scanner-instructions">
                    <h3>Instrucciones</h3>
                    <ul>
                        <li><strong>CHECK-IN:</strong> Registra la entrada del vehículo al estacionamiento</li>
                        <li><strong>CHECK-OUT:</strong> Registra la salida y calcula el cobro automáticamente</li>
                        <li>El código QR debe tener exactamente 8 caracteres alfanuméricos</li>
                        <li>Después del checkout, verás el detalle completo del cobro</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
