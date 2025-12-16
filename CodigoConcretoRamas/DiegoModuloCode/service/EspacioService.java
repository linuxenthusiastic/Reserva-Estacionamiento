package com.parking.system.service;

import com.parking.system.factory.EspacioFactory;
import com.parking.system.factory.EspacioFactoryProvider;
import com.parking.system.model.Espacio;
import com.parking.system.model.EstadoEspacio;
import com.parking.system.model.TipoEspacio;
import com.parking.system.strategy.DisponibilidadStrategy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EspacioService {
    private List<Espacio> espacios = new ArrayList<>();
    private int siguienteId = 1;
    /*
    private ReservaService reservaService = new ReservarService();
    */

    /*
    public List<Reserva> obtenerReservasDeEspacio(int espacioId) {
        return reservaService.obtenerTodas().stream()
                .filter(r -> r.getEspacioId() == espacioId)
                .toList();
    }
    */


    //Crear un nuevo espacio
    public Espacio crearEspacio(int numero, TipoEspacio tipo, int sedeId) {
        EspacioFactory factory = EspacioFactoryProvider.getFactory(tipo);
        Espacio nuevoEspacio = factory.crearEspacio(siguienteId++, numero, sedeId);
        espacios.add(nuevoEspacio);
        return nuevoEspacio;
    }

    public List<Espacio> obtenerEspacios() {
        return espacios;
    }

    //Obtener espacios de una sede especifica por Id
    public List<Espacio> obtenerPorSede(int sedeId) {
        return espacios.stream()
                .filter(e -> e.getSedeId() == sedeId)
                .collect(Collectors.toList());
    }

    //Obtener un espacio por Id
    public Espacio obtenerPorId(int id) {
        return espacios.stream()
                .filter(e -> e.getId() == id)
                .findFirst()
                .orElse(null);
    }

    //Actualizar estado de un espacio por Id
    public boolean actualizarEstado(int id, EstadoEspacio estado) {
        Espacio espacio =  obtenerPorId(id);
        if(espacio == null) return false;

        espacio.setEstado(estado);
        return true;
    }

    //Eliminar espacio por Id
    public boolean eliminar(int id) {
        return espacios.removeIf(e -> e.getId() == id);
    }

    //Filtrar en base a la estrategia
    public List<Espacio> filtrarDisponibilidad(DisponibilidadStrategy strategy) {
        return strategy.filtrar(espacios);
    }

    public void crearMuchosEspacios(int sedeId) {
        int cantidadPorTipo = 10;
        int numero = espacios.size();
        int tiposDeEspacio = 4;

        for(int i = 0; i < tiposDeEspacio; ++i) {
            for(int j = 0; j < cantidadPorTipo; ++j) {
                switch (i) {
                    case 0 -> crearEspacio(numero++, TipoEspacio.AUTO, sedeId);
                    case 1 -> crearEspacio(numero++, TipoEspacio.MOTO, sedeId);
                    case 2 -> crearEspacio(numero++, TipoEspacio.DISCAPACITADO, sedeId);
                    case 3 -> crearEspacio(numero++, TipoEspacio.VIP, sedeId);
                }
            }
        }
    }
}
