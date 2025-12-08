package com.parking.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/prueba")
    public String Saludar() {
        return "Modulo Usuarios funcionando";
    }
}
