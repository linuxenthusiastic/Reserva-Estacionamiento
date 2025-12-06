package com.reservas.estacionamiento.controller;

import com.reservas.estacionamiento.model.Espacio;
import com.reservas.estacionamiento.model.EstadoEspacio;
import com.reservas.estacionamiento.model.TipoEspacio;
import com.reservas.estacionamiento.service.EspacioService;
import com.reservas.estacionamiento.strategy.DisponibilidadPorEstado;
import com.reservas.estacionamiento.strategy.DisponibilidadPorTipo;
import com.reservas.estacionamiento.strategy.DisponibilidadStrategy;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/espacios")
public class EspacioController {
    private final EspacioService espacioService;

    public EspacioController(EspacioService espacioService) {
        this.espacioService = espacioService;
    }

    @PostMapping
    public Espacio crear(@RequestBody Espacio nuevoEspacio) {
        return espacioService.crear(
                nuevoEspacio.getNumero(),
                nuevoEspacio.getTipo(),
                nuevoEspacio.getSedeId()
        );
    }

    @GetMapping
    public List<Espacio> obtenerEspacios() {
        return espacioService.obtenerEspacios();
    }

    @GetMapping("/sede/{sedeId}")
    public List<Espacio> obtenerPorSede(@PathVariable int sedeId) {
        return espacioService.obtenerPorSede(sedeId);
    }

    @PutMapping("/{id}/estado")
    public boolean actualizarEstado(@PathVariable int id, @RequestBody EstadoEspacio estado) {
        return espacioService.actualizarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable int id) {
        return espacioService.eliminar(id);
    }

    @GetMapping("/filtrar/estado")
    public List<Espacio> disponibilidadPorEstado() {
        return espacioService.filtrarDisponibilidad(new DisponibilidadPorEstado());
    }

    @GetMapping("filtrar/tipo/{tipo}")
    public List<Espacio> disponibilidadPorTipo(@PathVariable String tipo) {
        DisponibilidadStrategy strategy = new DisponibilidadPorTipo(TipoEspacio.valueOf(tipo.toUpperCase()));
        return espacioService.filtrarDisponibilidad(strategy);
    }

}
