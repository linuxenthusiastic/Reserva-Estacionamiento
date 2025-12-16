import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Credenciales incorrectas');
            setIsLoading(false);
        }
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-content">
                    <div className="brand">
                        <div className="brand-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"></path>
                                <polygon points="12 15 17 21 7 21 12 15"></polygon>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <h1>Parking Pro</h1>
                            <p>Sistema de Gestión</p>
                        </div>
                    </div>

                    <div className="welcome">
                        <h2>Bienvenido de nuevo</h2>
                        <p>Ingresa tus credenciales para continuar</p>
                    </div>

                    <div className="credentials-section">
                        <h3>Credenciales de Prueba</h3>
                        <div className="credential-cards">
                            <div className="credential-card admin">
                                <div className="card-header">
                                    <div className="card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <div className="card-title">
                                        <h4>Administrador</h4>
                                        <span>Control total</span>
                                    </div>
                                </div>
                                <div className="card-credentials">
                                    <div className="credential-item" onClick={() => copyText('admin@parking.com')}>
                                        <span className="label">Email:</span>
                                        <span className="value">admin@parking.com</span>
                                    </div>
                                    <div className="credential-item" onClick={() => copyText('admin123')}>
                                        <span className="label">Password:</span>
                                        <span className="value">admin123</span>
                                    </div>
                                </div>
                            </div>

                            <div className="credential-card operator">
                                <div className="card-header">
                                    <div className="card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path>
                                        </svg>
                                    </div>
                                    <div className="card-title">
                                        <h4>Operador</h4>
                                        <span>Control de accesos</span>
                                    </div>
                                </div>
                                <div className="card-credentials">
                                    <div className="credential-item" onClick={() => copyText('operador@parking.com')}>
                                        <span className="label">Email:</span>
                                        <span className="value">operador@parking.com</span>
                                    </div>
                                    <div className="credential-item" onClick={() => copyText('operador123')}>
                                        <span className="label">Password:</span>
                                        <span className="value">operador123</span>
                                    </div>
                                </div>
                            </div>

                            <div className="credential-card client">
                                <div className="card-header">
                                    <div className="card-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"></path>
                                            <polygon points="12 15 17 21 7 21 12 15"></polygon>
                                        </svg>
                                    </div>
                                    <div className="card-title">
                                        <h4>Cliente</h4>
                                        <span>Reservas</span>
                                    </div>
                                </div>
                                <div className="card-credentials">
                                    <div className="credential-item" onClick={() => copyText('user@parking.com')}>
                                        <span className="label">Email:</span>
                                        <span className="value">user@parking.com</span>
                                    </div>
                                    <div className="credential-item" onClick={() => copyText('user123')}>
                                        <span className="label">Password:</span>
                                        <span className="value">user123</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@parking.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <div className="illustration">
                    <div className="floating-card card-1">
                        <div className="mini-icon">🚗</div>
                        <p>Gestión Inteligente</p>
                    </div>
                    <div className="floating-card card-2">
                        <div className="mini-icon">📊</div>
                        <p>Reportes en Tiempo Real</p>
                    </div>
                    <div className="floating-card card-3">
                        <div className="mini-icon">🔒</div>
                        <p>Seguridad Garantizada</p>
                    </div>
                    <div className="center-graphic">
                        <div className="graphic-circle circle-1"></div>
                        <div className="graphic-circle circle-2"></div>
                        <div className="graphic-circle circle-3"></div>
                        <div className="main-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"></path>
                                <polygon points="12 15 17 21 7 21 12 15"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
