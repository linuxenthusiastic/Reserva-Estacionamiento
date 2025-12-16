package com.parking.system.service;

import com.parking.system.model.Membresia;
import com.parking.system.model.TipoMembresia;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MembresiaService {

    private final List<Membresia> membresias = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    /**
     * Verifica si un usuario tiene una membresía activa y vigente
     */
    public boolean tieneMembresiaVigente(Long usuarioId) {
        return membresias.stream()
                .filter(m -> m.getUsuarioId().equals(usuarioId))
                .anyMatch(Membresia::estaVigente);
    }

    /**
     * Obtiene la membresía activa de un usuario
     */
    public Optional<Membresia> obtenerMembresiaActiva(Long usuarioId) {
        return membresias.stream()
                .filter(m -> m.getUsuarioId().equals(usuarioId))
                .filter(Membresia::estaVigente)
                .findFirst();
    }

    /**
     * Crea una nueva membresía para un usuario
     */
    public Membresia crearMembresia(Long usuarioId, TipoMembresia tipo) {
        Membresia membresia = new Membresia();
        membresia.setId(idGenerator.getAndIncrement());
        membresia.setUsuarioId(usuarioId);
        membresia.setTipo(tipo);
        membresia.setFechaInicio(LocalDate.now());

        // Calcular fecha fin según tipo
        LocalDate fechaFin = switch (tipo) {
            case MENSUAL -> LocalDate.now().plusMonths(1);
            case TRIMESTRAL -> LocalDate.now().plusMonths(3);
            case ANUAL -> LocalDate.now().plusYears(1);
        };

        membresia.setFechaFin(fechaFin);
        membresia.setActiva(true);

        membresias.add(membresia);
        System.out.println(">>> MEMBRESÍA: Creada para usuario " + usuarioId + " - Tipo: " + tipo + " - Válida hasta: "
                + fechaFin);

        return membresia;
    }

    /**
     * Renueva una membresía existente
     */
    public Membresia renovarMembresia(Long membresiaId) {
        Optional<Membresia> membresiaOpt = membresias.stream()
                .filter(m -> m.getId().equals(membresiaId))
                .findFirst();

        if (membresiaOpt.isEmpty()) {
            throw new IllegalArgumentException("Membresía no encontrada");
        }

        Membresia membresia = membresiaOpt.get();
        LocalDate nuevaFechaInicio = membresia.getFechaFin().plusDays(1);

        LocalDate nuevaFechaFin = switch (membresia.getTipo()) {
            case MENSUAL -> nuevaFechaInicio.plusMonths(1);
            case TRIMESTRAL -> nuevaFechaInicio.plusMonths(3);
            case ANUAL -> nuevaFechaInicio.plusYears(1);
        };

        membresia.setFechaInicio(nuevaFechaInicio);
        membresia.setFechaFin(nuevaFechaFin);
        membresia.setActiva(true);

        System.out.println(">>> MEMBRESÍA: Renovada #" + membresiaId + " - Válida hasta: " + nuevaFechaFin);

        return membresia;
    }

    /**
     * Cancela una membresía
     */
    public void cancelarMembresia(Long membresiaId) {
        membresias.stream()
                .filter(m -> m.getId().equals(membresiaId))
                .findFirst()
                .ifPresent(m -> {
                    m.setActiva(false);
                    System.out.println(">>> MEMBRESÍA: Cancelada #" + membresiaId);
                });
    }

    /**
     * Obtiene todas las membresías de un usuario
     */
    public List<Membresia> obtenerPorUsuario(Long usuarioId) {
        return membresias.stream()
                .filter(m -> m.getUsuarioId().equals(usuarioId))
                .toList();
    }

    /**
     * Obtiene todas las membresías
     */
    public List<Membresia> obtenerTodas() {
        return new ArrayList<>(membresias);
    }
}
