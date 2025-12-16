package com.parking.system.dto;

import java.time.LocalDateTime;

public class FacturaResponse {
    private Long id;
    private String nit;
    private double total;
    private LocalDateTime fecha;

    public FacturaResponse(Long id, String nit, double total, LocalDateTime fecha) {
        this.id = id;
        this.nit = nit;
        this.total = total;
        this.fecha = fecha;
    }

    public Long getId() {
        return id;
    }

    public String getNit() {
        return nit;
    }

    public double getTotal() {
        return total;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }
}
