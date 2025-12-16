package com.parking.system.config;

import com.parking.system.model.Rol;
import com.parking.system.model.Usuario;
import com.parking.system.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Admin
            if (usuarioRepository.findByEmail("admin@parking.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador Principal");
                admin.setEmail("admin@parking.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRol(Rol.ADMIN);
                admin.setTelefono("77777777");
                usuarioRepository.save(admin);
                System.out.println(">>> Usuario ADMIN creado: admin@parking.com / admin123");
            }

            // Operador
            if (usuarioRepository.findByEmail("operador@parking.com").isEmpty()) {
                Usuario operador = new Usuario();
                operador.setNombre("Juan Perez (Operador)");
                operador.setEmail("operador@parking.com");
                operador.setPassword(passwordEncoder.encode("operador123"));
                operador.setRol(Rol.OPERADOR);
                operador.setTelefono("66666666");
                usuarioRepository.save(operador);
                System.out.println(">>> Usuario OPERADOR creado: operador@parking.com / operador123");
            }

            // Conductor
            if (usuarioRepository.findByEmail("user@parking.com").isEmpty()) {
                Usuario conductor = new Usuario();
                conductor.setNombre("Ana Cliente (Conductor)");
                conductor.setEmail("user@parking.com");
                conductor.setPassword(passwordEncoder.encode("user123"));
                conductor.setRol(Rol.CONDUCTOR);
                conductor.setTelefono("55555555");
                usuarioRepository.save(conductor);
                System.out.println(">>> Usuario CONDUCTOR creado: user@parking.com / user123");
            }
        };
    }
}
