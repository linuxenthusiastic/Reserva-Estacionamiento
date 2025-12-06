package com.reservas.estacionamiento.controller;

import com.reservas.estacionamiento.model.Sede;
import com.reservas.estacionamiento.service.SedeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sedes")
public class SedeController {
    private final SedeService sedeService;

    public SedeController(SedeService sedeService) {
        this.sedeService = sedeService;
    }

    @GetMapping
    public List<Sede> obtenerSedes() {
        return sedeService.obtenerSedes();
    }

    @PostMapping
    public Sede crear(@RequestBody Sede nuevaSede) {
        return sedeService.crear(
                nuevaSede.getNombre(),
                nuevaSede.getDireccion(),
                nuevaSede.getCiudad()
        );
    }

    @GetMapping("/{id}")
    public Sede obtenerPorId(@PathVariable int id) {
        return sedeService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public boolean actualizar(@PathVariable int id, @RequestBody Sede sedeActualizar) {
        return sedeService.actualizar(
                id,
                sedeActualizar.getNombre(),
                sedeActualizar.getDireccion(),
                sedeActualizar.getCiudad()
        );
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable int id) {
        return sedeService.eliminar(id);
    }

}
