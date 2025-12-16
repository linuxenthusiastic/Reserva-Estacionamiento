import React, { useState, useEffect } from 'react';
import { Users, CreditCard, CheckCircle, XCircle, Calendar } from 'lucide-react';
import './MembresiasPage.css';

const API_URL = 'http://localhost:8080';

export default function MembresiasPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/usuarios`);
            if (response.ok) {
                const data = await response.json();
                // Filtrar solo usuarios (no admin/operador)
                const usuariosClientes = data.filter(u => u.rol === 'USUARIO');

                // Cargar membresías para cada usuario
                const usuariosConMembresia = await Promise.all(
                    usuariosClientes.map(async (usuario) => {
                        try {
                            const membresiaResponse = await fetch(`${API_URL}/api/membresias/usuario/${usuario.id}`);
                            if (membresiaResponse.ok) {
                                const membresias = await membresiaResponse.json();
                                const membresiaActiva = membresias.find(m => m.activa);
                                return { ...usuario, membresia: membresiaActiva };
                            }
                        } catch (error) {
                            console.error(`Error cargando membresía para usuario ${usuario.id}:`, error);
                        }
                        return { ...usuario, membresia: null };
                    })
                );

                setUsuarios(usuariosConMembresia);
            }
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const activarMembresia = async (usuarioId) => {
        if (!window.confirm('¿Activar membresía para este usuario?')) return;

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
                alert('Membresía activada exitosamente');
                cargarUsuarios();
            } else {
                alert('Error al activar membresía');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };

    const desactivarMembresia = async (membresiaId) => {
        if (!window.confirm('¿Desactivar membresía? El usuario volverá a pagar tarifas normales.')) return;

        try {
            const response = await fetch(`${API_URL}/api/membresias/${membresiaId}/cancelar`, {
                method: 'PUT'
            });

            if (response.ok) {
                alert('Membresía desactivada exitosamente');
                cargarUsuarios();
            } else {
                alert('Error al desactivar membresía');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };

    return (
        <div className="membresias-page">
            <div className="page-header">
                <div>
                    <h1>🎫 Gestión de Membresías</h1>
                    <p>Activar y desactivar membresías de usuarios</p>
                </div>
            </div>

            {loading && <div className="loading">Cargando usuarios...</div>}

            <div className="usuarios-grid">
                {usuarios.map(usuario => (
                    <div key={usuario.id} className="usuario-card">
                        <div className="card-header">
                            <div className="user-info">
                                <Users size={24} />
                                <div>
                                    <h3>{usuario.nombre}</h3>
                                    <p className="email">{usuario.email}</p>
                                </div>
                            </div>
                            {usuario.membresia ? (
                                <div className="badge-activa">
                                    <CheckCircle size={16} />
                                    ACTIVA
                                </div>
                            ) : (
                                <div className="badge-inactiva">
                                    <XCircle size={16} />
                                    SIN MEMBRESÍA
                                </div>
                            )}
                        </div>

                        <div className="card-body">
                            {usuario.membresia ? (
                                <>
                                    <div className="membresia-info">
                                        <div className="info-item">
                                            <CreditCard size={18} />
                                            <span>Tipo: {usuario.membresia.tipo}</span>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={18} />
                                            <span>
                                                Desde: {new Date(usuario.membresia.fechaInicio).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={18} />
                                            <span>
                                                Hasta: {new Date(usuario.membresia.fechaFin).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-desactivar"
                                        onClick={() => desactivarMembresia(usuario.membresia.id)}
                                    >
                                        Desactivar Membresía
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="sin-membresia-text">
                                        Este usuario no tiene membresía activa. Paga tarifas normales.
                                    </p>
                                    <button
                                        className="btn-activar"
                                        onClick={() => activarMembresia(usuario.id)}
                                    >
                                        Activar Membresía
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!loading && usuarios.length === 0 && (
                <div className="empty-state">
                    <Users size={64} />
                    <p>No hay usuarios registrados</p>
                </div>
            )}
        </div>
    );
}
