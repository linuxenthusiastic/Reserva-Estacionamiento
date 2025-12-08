package com.parking.system.service;

import com.parking.system.model.PaseMensual;
import com.parking.system.model.PrecioPaseContext;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class PaseMensualService {
    
    private final List<PaseMensual> pases = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final PrecioPaseContext precioPaseContext;
    
    public PaseMensualService(PrecioPaseContext precioPaseContext) {
        this.precioPaseContext = precioPaseContext;
    }
    
    public PaseMensual crearPase(Long usuarioId, String tipo, Long espacioAsignado) {
        // Validar tipo
        if (!esTipoValido(tipo)) {
            throw new IllegalArgumentException("Tipo de pase inválido. Tipos válidos: BASICO, PREMIUM, EMPRESARIAL");
        }
        
        // Crear pase
        PaseMensual pase = new PaseMensual();
        pase.setId(idGenerator.getAndIncrement());
        pase.setUsuarioId(usuarioId);
        pase.setTipo(tipo);
        pase.setEspacioAsignado(espacioAsignado);
        
        // Fechas: inicia hoy, vence en 30 días
        LocalDateTime ahora = LocalDateTime.now();
        pase.setFechaInicio(ahora);
        pase.setFechaVencimiento(ahora.plusDays(30));
        
        // Calcular precio usando Strategy Pattern
        BigDecimal precio = precioPaseContext.calcularPrecio(tipo);
        pase.setPrecio(precio);
        
        pases.add(pase);
        return pase;
    }
    
    public List<PaseMensual> obtenerTodos() {
        return new ArrayList<>(pases);
    }
    
    public Optional<PaseMensual> obtenerPorId(Long id) {
        return pases.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }
    
    public List<PaseMensual> obtenerPorUsuario(Long usuarioId) {
        return pases.stream()
                .filter(p -> p.getUsuarioId().equals(usuarioId))
                .collect(Collectors.toList());
    }
    
    public List<PaseMensual> obtenerVigentes() {
        return pases.stream()
                .filter(PaseMensual::estaVigente)
                .collect(Collectors.toList());
    }
    
    public boolean cancelarPase(Long id) {
        Optional<PaseMensual> paseOpt = obtenerPorId(id);
        
        if (paseOpt.isPresent()) {
            paseOpt.get().setEstado("CANCELADO");
            return true;
        }
        
        return false;
    }
    
    public boolean renovarPase(Long id) {
        Optional<PaseMensual> paseOpt = obtenerPorId(id);
        
        if (paseOpt.isEmpty()) {
            return false;
        }
        
        PaseMensual pase = paseOpt.get();
        
        // Extender vencimiento 30 días más
        pase.setFechaVencimiento(pase.getFechaVencimiento().plusDays(30));
        pase.setEstado("ACTIVO");
        
        return true;
    }
    
    private boolean esTipoValido(String tipo) {
        return "BASICO".equals(tipo) || "PREMIUM".equals(tipo) || "EMPRESARIAL".equals(tipo);
    }
}