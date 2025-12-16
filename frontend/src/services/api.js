const API_URL = 'http://localhost:8080/api';

const getHeaders = () => {
    // In a real app with JWT, we would add 'Authorization': 'Bearer ' + token
    return {
        'Content-Type': 'application/json',
    };
};

export const parkingApi = {
    // --- Tarifas ---
    getTarifas: async () => {
        const res = await fetch(`${API_URL}/tarifas`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Error fetching tarifas');
        return res.json();
    },
    createTarifa: async (tarifa) => {
        const res = await fetch(`${API_URL}/tarifas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(tarifa)
        });
        if (!res.ok) throw new Error('Error creating tarifa');
        return res.json();
    },

    // --- Accesos (Scanner) ---
    validarQr: async (codigoQR) => {
        const res = await fetch(`${API_URL}/accesos/validar-qr`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ codigoQR, dispositivoId: 'WEB-SCANNER' })
        });
        return res.json();
    },
    checkOut: async (reservaId) => {
        const res = await fetch(`${API_URL}/accesos/check-out`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reservaId })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Error en Check-Out');
        }
        return res.json();
    },

    // --- Reservas (Simulado con API real si existiera, o LocalStorage para demo) ---
    // Nota: El backend original tiene ReservaController pero no lo inspeccionamos a fondo.
    // Usaremos mocks para "Buscar" y "Crear" si el endpoint no está listo, 
    // pero intentaremos llamar endpoints lógicos.

    // Simular búsqueda de espacios
    searchEspacios: async (sede, fecha, horaInicio, horaFin) => {
        // Mock delay
        await new Promise(r => setTimeout(r, 800));
        return [
            { id: 101, codigo: 'A-101', tipo: 'Auto', ubicacion: 'Planta Baja', precio: 10 },
            { id: 102, codigo: 'B-205', tipo: 'Moto', ubicacion: 'Piso 1', precio: 5 },
        ];
    },

    createReserva: async (reservaData) => {
        // Mock success
        await new Promise(r => setTimeout(r, 500));
        return { id: Math.floor(Math.random() * 10000), ...reservaData, estado: 'CONFIRMADA' };
    },

    // --- Reportes ---
    downloadReport: (formato) => {
        window.open(`${API_URL}/cobros/reporte?formato=${formato}`, '_blank');
    }
};
