package com.parking.system.controller;

import com.parking.system.model.Tarifa;
import com.parking.system.repository.TarifaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarifas")
public class TarifaController {

    private final TarifaRepository tarifaRepository;

    @Autowired
    public TarifaController(TarifaRepository tarifaRepository) {
        this.tarifaRepository = tarifaRepository;
    }

    @PostMapping
    public ResponseEntity<Tarifa> crearTarifa(@RequestBody Tarifa tarifa) {
        Tarifa nueva = tarifaRepository.guardar(tarifa);
        return ResponseEntity.ok(nueva);
    }

    @GetMapping
    public ResponseEntity<List<Tarifa>> listarTarifas() {
        return ResponseEntity.ok(tarifaRepository.listarTodas());
    }
}
