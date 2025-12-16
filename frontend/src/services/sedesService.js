const API_URL = 'http://localhost:8080';

// Helper para obtener headers con autenticación
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const sedesService = {
    async getSedes() {
        const response = await fetch(`${API_URL}/sedes`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener sedes');
        return response.json();
    },

    async getSedeById(id) {
        const response = await fetch(`${API_URL}/sedes/${id}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener sede');
        return response.json();
    },

    async createSede(data) {
        const response = await fetch(`${API_URL}/sedes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al crear sede');
        return response.json();
    },

    async updateSede(id, data) {
        const response = await fetch(`${API_URL}/sedes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al actualizar sede');
        return response.json();
    },

    async deleteSede(id) {
        const response = await fetch(`${API_URL}/sedes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Error al eliminar sede');
        return response.ok;
    }
};
