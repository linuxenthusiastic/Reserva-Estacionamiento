const App = {
    state: {
        role: 'conductor',
        currentView: 'home-conductor'
    },

    init: () => {
        App.switchRole();
        App.loadTarifas(); // Preload for admin/display
    },

    // --- Navigation & Role ---

    switchRole: () => {
        const role = document.getElementById('roleSelect').value;
        App.state.role = role;

        // Update Nav Items
        document.querySelectorAll('.nav-item').forEach(item => {
            const itemRole = item.getAttribute('data-role');
            if (itemRole === role) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Default landing page per role
        const defaultViews = {
            'conductor': 'home-conductor',
            'operador': 'scanner',
            'admin': 'dashboard-admin'
        };
        App.navigate(defaultViews[role] || 'home-conductor');

        // Update Profile Name
        const names = {
            'conductor': 'Juan Pérez',
            'operador': 'Agente Smith',
            'admin': 'Admin Principal'
        };
        document.getElementById('usernameDisplay').innerText = names[role];
    },

    navigate: (viewId) => {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active', 'hidden'));
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

        // Show target
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }

        // Active Nav State
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    },

    // --- API Interactions ---

    handleSearch: (e) => {
        e.preventDefault();
        // Simulación de búsqueda (Endpoint real: GET /api/espacios/disponibles)
        const container = document.getElementById('searchResults');
        container.innerHTML = '<div class="alert alert-success">Buscando espacios...</div>';

        setTimeout(() => {
            container.innerHTML = `
                <div class="card-glass" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3>Espacio A-102 (Sede Central)</h3>
                        <p class="text-muted">Techado • Planta Baja</p>
                    </div>
                    <button class="btn-primary" onclick="App.createReservation()">Reservar</button>
                </div>
                <div class="card-glass" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3>Espacio B-05 (Sede Norte)</h3>
                        <p class="text-muted">Aire Libre</p>
                    </div>
                    <button class="btn-primary" onclick="App.createReservation()">Reservar</button>
                </div>
            `;
        }, 1000);
    },

    createReservation: () => {
        // En una app real, llamaríamos a POST /api/reservas
        if (confirm("¿Confirmar reserva?")) {
            App.showAlert('Reserva creada con éxito. ID: RES-12345', 'success');
            // Añadir a "Mis Reservas" visualmente
            const list = document.getElementById('myReservationsList');
            const item = document.createElement('div');
            item.className = 'card-glass';
            item.innerHTML = `
                <h3>Reserva #RES-12345</h3>
                <p>Fecha: Hoy | Horario: 10:00 - 12:00</p>
                <div style="background: white; padding: 10px; width: fit-content; margin-top: 10px; border-radius: 8px;">
                    <i class="fa-solid fa-qrcode" style="color:black; font-size: 50px;"></i>
                </div>
                <small style="color: black; background: white; padding: 2px;">QR Code Simulado</small>
            `;
            list.prepend(item);
        }
    },

    // --- Operador Logic ---

    handleCheckIn: async () => {
        const qr = document.getElementById('qrInput').value;
        if (!qr) return App.showAlert('Ingrese un código QR', 'error');

        // Endpoint: POST /api/accesos/validar-qr o check-in directo
        try {
            const response = await fetch('/api/accesos/validar-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoQR: qr, dispositivoId: 'WEB-SCANNER' })
            });
            const data = await response.json();

            const resultDiv = document.getElementById('accessResult');
            resultDiv.classList.remove('hidden');

            if (data.valido) {
                resultDiv.innerHTML = `<div class="alert alert-success">✅ Acceso Permitido. Barrera Abierta.</div>`;
            } else {
                resultDiv.innerHTML = `<div class="alert alert-error">⛔ Acceso Denegado: ${data.mensaje}</div>`;
            }

        } catch (error) {
            console.error(error);
            App.showAlert('Error de conexión con el servidor', 'error');
        }
    },

    handleCheckOut: async () => {
        // Simular Check-Out
        const qr = document.getElementById('qrInput').value;
        // Asumimos que el input es el ID de reserva para el checkout manual en este MVP
        // Endpoint: POST /api/accesos/check-out
        // Nota: El backend espera { reservaId: long }

        // Hack para MVP: intentar parsear ID numérico del input, o usar default
        const id = parseInt(qr.replace(/\D/g, '')) || 1;

        try {
            const response = await fetch('/api/accesos/check-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservaId: id })
            });

            if (response.ok) {
                const data = await response.json();
                App.showAlert(`Salida registrada. Tiempo: ${data.tiempoTotalMinutos} min. Calcular cobro...`, 'success');
                // Auto-redirect to payment calc for operator?
            } else {
                const err = await response.json();
                App.showAlert(`Error Checkout: ${err.error}`, 'error');
            }
        } catch (error) {
            App.showAlert('Error de red', 'error');
        }
    },

    // --- Admin Logic ---

    loadTarifas: async () => {
        try {
            const res = await fetch('/api/tarifas');
            if (res.ok) {
                const tarifas = await res.json();
                const tbody = document.getElementById('tarifasTableBody');
                tbody.innerHTML = '';
                tarifas.forEach(t => {
                    const row = `<tr>
                        <td>${t.id}</td>
                        <td>${t.tipoVehiculo}</td>
                        <td>${t.precioUnitario} Bs</td>
                        <td>${t.horaInicioValidez} - ${t.horaFinValidez}</td>
                    </tr>`;
                    tbody.innerHTML += row;
                });
            }
        } catch (e) {
            console.log("No backend connection yet?");
        }
    },

    createTarifa: async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            tipoVehiculo: form.tipo.value,
            precioUnitario: parseFloat(form.precio.value),
            horaInicioValidez: "00:00:00",
            horaFinValidez: "23:59:59"
        };

        try {
            const res = await fetch('/api/tarifas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                App.showAlert('Tarifa guardada', 'success');
                App.loadTarifas();
                form.reset();
            }
        } catch (error) {
            App.showAlert('Error guardando tarifa', 'error');
        }
    },

    downloadReport: (type) => {
        window.open(`/api/cobros/reporte?formato=${type}`, '_blank');
    },

    // --- Utilities ---

    showAlert: (msg, type) => {
        const container = document.getElementById('alertContainer');
        container.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
        setTimeout(() => container.innerHTML = '', 4000);
    }
};

window.onload = App.init;
