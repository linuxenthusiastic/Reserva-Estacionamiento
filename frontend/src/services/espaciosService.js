const API_URL = 'http://localhost:8080';

export const espaciosService = {
    async getEspacios() {
        const response = await fetch(`${API_URL}/espacios`);
        if (!response.ok) throw new Error('Error al obtener espacios');
        return response.json();
    },

    async getEspaciosBySede(sedeId) {
        const response = await fetch(`${API_URL}/espacios/sede/${sedeId}`);
        if (!response.ok) throw new Error('Error al obtener espacios de la sede');
        return response.json();
    },

    async getEspaciosByEstado(sedeId, estado) {
        const response = await fetch(`${API_URL}/espacios/sede/${sedeId}/estado/${estado}`);
        if (!response.ok) throw new Error('Error al filtrar por estado');
        return response.json();
    },

    async getEspaciosByTipo(tipo) {
        const response = await fetch(`${API_URL}/espacios/filtrar/tipo/${tipo}`);
        if (!response.ok) throw new Error('Error al filtrar por tipo');
        return response.json();
    },

    async createEspacio(data) {
        const response = await fetch(`${API_URL}/espacios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error al crear espacio');
        return response.json();
    },

    async updateEstado(id, estado) {
        const response = await fetch(`${API_URL}/espacios/${id}/estado?estado=${estado}`, {
            method: 'PUT'
        });
        if (!response.ok) throw new Error('Error al actualizar estado');
        return response.json();
    },

    async deleteEspacio(id) {
        const response = await fetch(`${API_URL}/espacios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar espacio');
        return response.ok;
    },

    async crearMuchosEspacios(sedeId) {
        const response = await fetch(`${API_URL}/espacios/crearMuchos/${sedeId}`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Error al crear espacios masivos');
        return response.ok;
    }
};
