package com.reservas.estacionamiento.service;

import com.reservas.estacionamiento.factory.EspacioFactory;
import com.reservas.estacionamiento.factory.EspacioFactoryProvider;
import com.reservas.estacionamiento.model.Espacio;
import com.reservas.estacionamiento.model.EstadoEspacio;
import com.reservas.estacionamiento.model.TipoEspacio;
import com.reservas.estacionamiento.observer.EspacioSubject;
import com.reservas.estacionamiento.observer.LoggerObserver;
import com.reservas.estacionamiento.strategy.DisponibilidadStrategy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EspacioService {
    private List<Espacio> espacios = new ArrayList<>();
    private int siguienteId = 1;
    private EspacioSubject subject = new EspacioSubject();

    public EspacioService() {
        subject.agregarObservador(new LoggerObserver());
    }

    //Crear un nuevo espacio
    public Espacio crear(int numero, TipoEspacio tipo, int sedeId) {
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

    public boolean updateEstado(int id, EstadoEspacio estado) {
        Espacio espacio = obtenerPorId(id);
        if (espacio == null) return false;

        espacio.setEstado(estado);
        subject.notificarObservadores(espacio);
        return true;
    }
}
