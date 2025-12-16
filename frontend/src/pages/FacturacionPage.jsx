import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Receipt, Printer, Download, FileText, Search, AlertCircle } from 'lucide-react';
import './FacturacionPage.css';

const API_URL = 'http://localhost:8080';

export default function FacturacionPage() {
    const [searchParams] = useSearchParams();
    const facturaIdFromUrl = searchParams.get('id');

    const [facturas, setFacturas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState(facturaIdFromUrl || '');

    useEffect(() => {
        cargarFacturas();

        // Si viene un ID en la URL, buscar esa factura específica
        if (facturaIdFromUrl) {
            buscarFacturaPorId(facturaIdFromUrl);
        }
    }, [facturaIdFromUrl]);

    const cargarFacturas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/cobros/facturas`);
            if (response.ok) {
                const data = await response.json();
                setFacturas(data);
            }
        } catch (error) {
            console.error('Error cargando facturas:', error);
        } finally {
            setLoading(false);
        }
    };

    const buscarFacturaPorId = async (id) => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/cobros/factura/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFacturaSeleccionada(data);
            } else {
                alert(`Factura #${id} no encontrada`);
            }
        } catch (error) {
            console.error('Error buscando factura:', error);
            alert('Error al buscar la factura');
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        if (searchId) {
            buscarFacturaPorId(searchId);
        }
    };

    const handlePrint = (factura) => {
        window.print();
    };

    const handleDownload = (factura) => {
        // Crear contenido de la factura
        const contenido = `
FACTURA #${factura.id}
========================================
Fecha: ${new Date(factura.fechaEmision).toLocaleString('es-ES')}
NIT: ${factura.nitCliente}
Monto: Bs. ${factura.montoTotal.toFixed(2)}
========================================

Gracias por su preferencia.
        `;

        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Factura-${factura.id}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const cerrarDetalle = () => {
        setFacturaSeleccionada(null);
        setSearchId('');
        // Limpiar el parámetro de la URL
        window.history.pushState({}, '', '/facturacion');
    };

    return (
        <div className="facturacion-page">
            <div className="facturacion-header">
                <div>
                    <h1>📄 Facturación</h1>
                    <p>Gestiona y visualiza facturas generadas</p>
                </div>
            </div>

            {/* Buscador de factura */}
            <div className="search-section">
                <form onSubmit={handleBuscar} className="search-form">
                    <div className="search-input-group">
                        <Search size={20} />
                        <input
                            type="number"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Buscar factura por ID..."
                            min="1"
                        />
                    </div>
                    <button type="submit" className="btn-search" disabled={!searchId || loading}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </div>

            {/* Detalle de factura seleccionada */}
            {facturaSeleccionada && (
                <div className="factura-detalle-card">
                    <div className="detalle-header">
                        <div className="header-left">
                            <Receipt size={32} />
                            <div>
                                <h2>Factura #{facturaSeleccionada.id}</h2>
                                <p className="fecha-detalle">
                                    {new Date(facturaSeleccionada.fechaEmision).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <button className="btn-close" onClick={cerrarDetalle}>✕</button>
                    </div>

                    <div className="detalle-body">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">NIT:</span>
                                <span className="value">{facturaSeleccionada.nitCliente}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Monto:</span>
                                <span className="value monto">Bs. {facturaSeleccionada.montoTotal?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="detalle-actions">
                            <button onClick={() => handlePrint(facturaSeleccionada)} className="btn-action-large">
                                <Printer size={20} />
                                Imprimir
                            </button>
                            <button onClick={() => handleDownload(facturaSeleccionada)} className="btn-action-large">
                                <Download size={20} />
                                Descargar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de todas las facturas */}
            <div className="facturas-section">
                <h2>Todas las Facturas</h2>

                {loading && <div className="loading">Cargando facturas...</div>}

                {!loading && facturas.length === 0 && (
                    <div className="empty-state">
                        <AlertCircle size={48} />
                        <p>No hay facturas generadas</p>
                    </div>
                )}

                <div className="facturas-list">
                    {facturas.map(factura => (
                        <div key={factura.id} className="factura-card">
                            <div className="factura-icon">
                                <Receipt size={24} />
                            </div>
                            <div className="factura-info">
                                <h3>Factura #{factura.id}</h3>
                                <p className="fecha">
                                    {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
                                </p>
                                <p className="nit">NIT: {factura.nitCliente}</p>
                            </div>
                            <div className="factura-monto">
                                <span className="amount">Bs. {factura.montoTotal?.toFixed(2)}</span>
                            </div>
                            <div className="factura-actions">
                                <button
                                    onClick={() => setFacturaSeleccionada(factura)}
                                    className="btn-action"
                                    title="Ver detalle"
                                >
                                    <FileText size={18} />
                                </button>
                                <button
                                    onClick={() => handlePrint(factura)}
                                    className="btn-action"
                                    title="Imprimir"
                                >
                                    <Printer size={18} />
                                </button>
                                <button
                                    onClick={() => handleDownload(factura)}
                                    className="btn-action"
                                    title="Descargar"
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
