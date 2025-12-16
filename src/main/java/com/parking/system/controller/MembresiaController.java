package com.parking.system.controller;

import com.parking.system.model.Membresia;
import com.parking.system.model.TipoMembresia;
import com.parking.system.service.MembresiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/membresias")
public class MembresiaController {

    private final MembresiaService membresiaService;

    @Autowired
    public MembresiaController(MembresiaService membresiaService) {
        this.membresiaService = membresiaService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Membresia>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(membresiaService.obtenerPorUsuario(usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<Membresia>> obtenerTodas() {
        return ResponseEntity.ok(membresiaService.obtenerTodas());
    }

    @PostMapping
    public ResponseEntity<?> crearMembresia(@RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());
            String tipoStr = request.get("tipo").toString();
            TipoMembresia tipo = TipoMembresia.valueOf(tipoStr);

            Membresia membresia = membresiaService.crearMembresia(usuarioId, tipo);
            return ResponseEntity.ok(membresia);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear membresía: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarMembresia(@PathVariable Long id) {
        try {
            membresiaService.cancelarMembresia(id);
            return ResponseEntity.ok(Map.of("mensaje", "Membresía cancelada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
