package com.parking.system.service;

import com.parking.system.model.Sede;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class SedeService {
    private List<Sede> sedes = new ArrayList<>();
    private int siguienteId = 1;

    private final EspacioService espacioService;

    @Autowired
    public SedeService(EspacioService espacioService) {
        this.espacioService = espacioService;
    }

    // Inicialización después de que Spring cree el bean
    @PostConstruct
    public void init() {
        System.out.println(">>> Inicializando SedeService con sedes por defecto...");
        crearSede("Sede Centro", "Av. 6 de Agosto #123", "Santa Cruz");
        crearSede("Sede Sur", "Calle Murillo #456", "Santa Cruz");
        System.out.println(">>> Sedes creadas: " + sedes.size());
    }

    // Devuleve todas las sedes
    public List<Sede> obtenerSedes() {
        return sedes;
    }

    // Crea una nueva sede y automáticamente crea espacios para ella
    public Sede crearSede(String nombre, String direccion, String ciudad) {
        Sede nuevaSede = new Sede(siguienteId++, nombre, direccion, ciudad);
        sedes.add(nuevaSede);

        // Crear automáticamente 10 espacios de cada tipo (40 total)
        espacioService.crearMuchosEspacios(nuevaSede.getId());
        System.out.println(">>> Espacios creados para sede: " + nuevaSede.getNombre());

        return nuevaSede;
    }

    // Devuelve una sede por ID
    public Sede obtenerPorId(int id) {
        return sedes.stream()
                .filter(s -> s.getId() == id)
                .findFirst()
                .orElse(null);
    }

    // Modifica los datos de una sede por ID
    public boolean actualizar(int id, String nombre, String direccion, String ciudad) {
        Sede s = obtenerPorId(id);
        if (s == null)
            return false;

        s.setNombre(nombre);
        s.setDireccion(direccion);
        s.setCiudad(ciudad);
        return true;
    }

    // Elimina una sede por ID
    public boolean eliminar(int id) {
        return sedes.removeIf(s -> s.getId() == id);
    }
}
