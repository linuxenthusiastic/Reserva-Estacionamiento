package com.reservas.estacionamiento.service;

import com.reservas.estacionamiento.model.Sede;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SedeService {
    private List<Sede> sedes = new ArrayList<>();
    private int siguienteId = 1;

    //Devuleve todas las sedes
    public List<Sede> obtenerSedes() {
        return sedes;
    }

    //Crea una nueva sede
    public Sede crear(String nombre, String direccion, String ciudad) {
        Sede nuevaSede = new Sede(siguienteId++, nombre, direccion, ciudad);
        sedes.add(nuevaSede);
        return nuevaSede;
    }

    //Devuelve una sede por ID
    public Sede obtenerPorId(int id) {
        return sedes.stream()
                .filter(s -> s.getId() == id)
                .findFirst()
                .orElse(null);
    }

    //Modifica los datos de una sede por ID
    public boolean actualizar(int id, String nombre, String direccion, String ciudad) {
        Sede s = obtenerPorId(id);
        if (s == null) return false;

        s.setNombre(nombre);
        s.setDireccion(direccion);
        s.setCiudad(ciudad);
        return true;
    }

    //Elimina una sede por ID
    public boolean eliminar(int id) {
        return sedes.removeIf(s -> s.getId() == id);
    }
}
