package com.parking.system.dto;

import java.time.LocalDateTime;

public class CobroRequestDTO {
    private String patente;
    private String tipoVehiculo;
    private LocalDateTime horaEntrada;
    private  LocalDateTime horaSalida;


    //Getters
    public LocalDateTime getHoraSalida() {
        return horaSalida;
    }

    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }

    public String getTipoVehiculo() {
        return tipoVehiculo;
    }

    public String getPatente() {
        return patente;
    }

    //Setters
    public void setPatente(String patente) {
        this.patente = patente;
    }

    public void setTipoVehiculo(String tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public void setHoraSalida(LocalDateTime horaSalida) {
        this.horaSalida = horaSalida;
    }


}
