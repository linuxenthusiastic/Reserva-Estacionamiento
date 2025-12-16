package com.parking.system.dto;

import java.time.LocalDateTime;

public class CheckInResponse {

    private Long id;
    private Long reservaId;
    private Long espacioId;
    private LocalDateTime horaEntrada;
    private String mensaje;

    public CheckInResponse() {
    }

    public CheckInResponse(Long id, Long reservaId, Long espacioId, LocalDateTime horaEntrada, String mensaje) {
        this.id = id;
        this.reservaId = reservaId;
        this.espacioId = espacioId;
        this.horaEntrada = horaEntrada;
        this.mensaje = mensaje;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReservaId() {
        return reservaId;
    }

    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }

    public Long getEspacioId() {
        return espacioId;
    }

    public void setEspacioId(Long espacioId) {
        this.espacioId = espacioId;
    }

    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
