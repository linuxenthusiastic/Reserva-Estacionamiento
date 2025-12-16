import React, { useState, useEffect } from 'react';
import { espaciosService } from '../services/espaciosService';
import { sedesService } from '../services/sedesService';
import { Car, Bike, Accessibility, Truck, Filter, Grid } from 'lucide-react';
import './EspaciosPage.css';

const ESTADO_COLORS = {
    DISPONIBLE: '#10b981',
    OCUPADO: '#ef4444',
    RESERVADO: '#f59e0b',
    MANTENIMIENTO: '#6b7280'
};

const TIPO_ICONS = {
    NORMAL: Car,
    MOTO: Bike,
    DISCAPACITADO: Accessibility,
    SUV: Truck
};

export default function EspaciosPage() {
    const [espacios, setEspacios] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [selectedSede, setSelectedSede] = useState(null);
    const [filterEstado, setFilterEstado] = useState('TODOS');
    const [filterTipo, setFilterTipo] = useState('TODOS');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSedes();
    }, []);

    useEffect(() => {
        if (selectedSede) {
            loadEspacios();
        }
    }, [selectedSede, filterEstado, filterTipo]);

    const loadSedes = async () => {
        try {
            const data = await sedesService.getSedes();
            setSedes(data);
            if (data.length > 0) {
                setSelectedSede(data[0].id);
            }
        } catch (error) {
            console.error('Error loading sedes:', error);
        }
    };

    const loadEspacios = async () => {
        try {
            setLoading(true);
            let data;

            if (filterEstado !== 'TODOS') {
                data = await espaciosService.getEspaciosByEstado(selectedSede, filterEstado);
            } else if (filterTipo !== 'TODOS') {
                data = await espaciosService.getEspaciosByTipo(filterTipo);
                data = data.filter(e => e.sedeId === selectedSede);
            } else {
                data = await espaciosService.getEspaciosBySede(selectedSede);
            }

            setEspacios(data);
        } catch (error) {
            console.error('Error loading espacios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEstadoChange = async (espacioId, nuevoEstado) => {
        try {
            await espaciosService.updateEstado(espacioId, nuevoEstado);
            loadEspacios();
        } catch (error) {
            console.error('Error updating estado:', error);
        }
    };

    const getEstadoLabel = (estado) => {
        const labels = {
            DISPONIBLE: 'Disponible',
            OCUPADO: 'Ocupado',
            RESERVADO: 'Reservado',
            MANTENIMIENTO: 'Mantenimiento'
        };
        return labels[estado] || estado;
    };

    return (
        <div className="espacios-page">
            <div className="espacios-header">
                <div>
                    <h1>Gestión de Espacios</h1>
                    <p>Visualiza y administra los espacios de estacionamiento</p>
                </div>
            </div>

            <div className="espacios-filters">
                <div className="filter-group">
                    <label>Sede:</label>
                    <select value={selectedSede || ''} onChange={(e) => setSelectedSede(Number(e.target.value))}>
                        {sedes.map(sede => (
                            <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Estado:</label>
                    <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                        <option value="TODOS">Todos</option>
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="OCUPADO">Ocupado</option>
                        <option value="RESERVADO">Reservado</option>
                        <option value="MANTENIMIENTO">Mantenimiento</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Tipo:</label>
                    <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                        <option value="TODOS">Todos</option>
                        <option value="NORMAL">Normal</option>
                        <option value="MOTO">Moto</option>
                        <option value="DISCAPACITADO">Discapacitado</option>
                        <option value="SUV">SUV</option>
                    </select>
                </div>
            </div>

            <div className="espacios-stats">
                <div className="stat-card disponible">
                    <div className="stat-value">{espacios.filter(e => e.estado === 'DISPONIBLE').length}</div>
                    <div className="stat-label">Disponibles</div>
                </div>
                <div className="stat-card ocupado">
                    <div className="stat-value">{espacios.filter(e => e.estado === 'OCUPADO').length}</div>
                    <div className="stat-label">Ocupados</div>
                </div>
                <div className="stat-card reservado">
                    <div className="stat-value">{espacios.filter(e => e.estado === 'RESERVADO').length}</div>
                    <div className="stat-label">Reservados</div>
                </div>
                <div className="stat-card mantenimiento">
                    <div className="stat-value">{espacios.filter(e => e.estado === 'MANTENIMIENTO').length}</div>
                    <div className="stat-label">Mantenimiento</div>
                </div>
            </div>

            {loading ? (
                <div className="espacios-loading">
                    <div className="spinner"></div>
                    <p>Cargando espacios...</p>
                </div>
            ) : (
                <div className="espacios-grid">
                    {espacios.map(espacio => {
                        const Icon = TIPO_ICONS[espacio.tipo] || Car;
                        return (
                            <div
                                key={espacio.id}
                                className="espacio-item"
                                style={{ borderColor: ESTADO_COLORS[espacio.estado] }}
                            >
                                <div className="espacio-header">
                                    <div className="espacio-numero">{espacio.numero}</div>
                                    <Icon size={20} />
                                </div>
                                <div className="espacio-tipo">{espacio.tipo}</div>
                                <select
                                    value={espacio.estado}
                                    onChange={(e) => handleEstadoChange(espacio.id, e.target.value)}
                                    className="espacio-estado-select"
                                    style={{ backgroundColor: ESTADO_COLORS[espacio.estado] }}
                                >
                                    <option value="DISPONIBLE">Disponible</option>
                                    <option value="OCUPADO">Ocupado</option>
                                    <option value="RESERVADO">Reservado</option>
                                    <option value="MANTENIMIENTO">Mantenimiento</option>
                                </select>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
