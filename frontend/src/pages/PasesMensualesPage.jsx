import React, { useState, useEffect } from 'react';
import './PasesMensualesPage.css';

const API_URL = 'http://localhost:8080';

export default function PasesMensualesPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/usuarios`);
            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }
            const data = await response.json();

            // Cargar membresías para cada usuario
            const usuariosConMembresia = await Promise.all(
                data.map(async (usuario) => {
                    try {
                        const membresiaResponse = await fetch(`${API_URL}/api/membresias/usuario/${usuario.id}`);
                        if (membresiaResponse.ok) {
                            const membresias = await membresiaResponse.json();
                            const membresiaActiva = membresias.find(m => m.activa);
                            return { ...usuario, membresia: membresiaActiva || null };
                        }
                    } catch (error) {
                        console.error(`Error cargando membresía para usuario ${usuario.id}:`, error);
                    }
                    return { ...usuario, membresia: null };
                })
            );

            setUsuarios(usuariosConMembresia);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar usuarios. Verifica que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    const activarMembresia = async (usuarioId, nombreUsuario) => {
        if (!window.confirm(`¿Activar membresía para ${nombreUsuario}?\n\nEl usuario quedará EXENTO DE PAGO en todas sus reservas.`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/membresias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuarioId: usuarioId,
                    tipo: 'MENSUAL'
                })
            });

            if (response.ok) {
                alert('✅ Membresía activada exitosamente\n\nEl usuario ya no pagará en sus reservas.');
                cargarUsuarios();
            } else {
                const errorText = await response.text();
                alert(`❌ Error al activar membresía: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión al activar membresía');
        }
    };

    const desactivarMembresia = async (membresiaId, nombreUsuario) => {
        if (!window.confirm(`¿Desactivar membresía de ${nombreUsuario}?\n\nEl usuario VOLVERÁ A PAGAR tarifas normales.`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/membresias/${membresiaId}/cancelar`, {
                method: 'PUT'
            });

            if (response.ok) {
                alert('✅ Membresía desactivada exitosamente\n\nEl usuario volverá a pagar tarifas normales.');
                cargarUsuarios();
            } else {
                const errorText = await response.text();
                alert(`❌ Error al desactivar membresía: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión al desactivar membresía');
        }
    };

    if (loading) {
        return (
            <div className="pases-container">
                <h1>🎫 Gestión de Membresías</h1>
                <div className="loading-message">
                    <p>⏳ Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pases-container">
                <h1>🎫 Gestión de Membresías</h1>
                <div className="error-message">
                    <p>❌ {error}</p>
                    <button onClick={cargarUsuarios} className="btn-retry">
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (usuarios.length === 0) {
        return (
            <div className="pases-container">
                <h1>🎫 Gestión de Membresías</h1>
                <div className="empty-message">
                    <p>📭 No hay usuarios registrados en el sistema</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pases-container">
            <div className="pases-header">
                <h1>🎫 Gestión de Membresías</h1>
                <p>Activar y desactivar membresías de usuarios</p>
            </div>

            <div className="usuarios-list">
                {usuarios.map(usuario => (
                    <div key={usuario.id} className="usuario-item">
                        <div className="usuario-info">
                            <div className="usuario-avatar">
                                {usuario.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="usuario-datos">
                                <h3>{usuario.nombre}</h3>
                                <p className="usuario-email">{usuario.email}</p>
                            </div>
                        </div>

                        <div className="usuario-estado">
                            {usuario.membresia ? (
                                <>
                                    <div className="badge activa">
                                        ✅ MEMBRESÍA ACTIVA
                                    </div>
                                    <div className="membresia-detalles">
                                        <p><strong>Tipo:</strong> {usuario.membresia.tipo}</p>
                                        <p><strong>Desde:</strong> {new Date(usuario.membresia.fechaInicio).toLocaleDateString('es-ES')}</p>
                                        <p><strong>Hasta:</strong> {new Date(usuario.membresia.fechaFin).toLocaleDateString('es-ES')}</p>
                                        <p className="beneficio">🎁 <strong>Beneficio:</strong> Exento de pago</p>
                                    </div>
                                    <button
                                        onClick={() => desactivarMembresia(usuario.membresia.id, usuario.nombre)}
                                        className="btn-desactivar"
                                    >
                                        ❌ Desactivar Membresía
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="badge inactiva">
                                        ⭕ SIN MEMBRESÍA
                                    </div>
                                    <p className="sin-membresia-info">
                                        💰 Este usuario paga tarifas normales
                                    </p>
                                    <button
                                        onClick={() => activarMembresia(usuario.id, usuario.nombre)}
                                        className="btn-activar"
                                    >
                                        ✅ Activar Membresía
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
