# 🚗 Sistema de Gestión de Estacionamiento

**Universidad:** Universidad Privada Franz Tamayo  
**Materia:** Programación III  
**Fecha:** Diciembre 2025  
**Tecnología:** Spring Boot 3.2.0 + Java 17

---

## 📖 INTRODUCCIÓN

Este documento presenta el **Sistema Integral de Gestión de Estacionamiento**, un proyecto desarrollado como trabajo final de la materia Programación III. El sistema implementa una solución completa para la administración de estacionamientos, integrando gestión de usuarios, espacios, reservas, control de acceso y facturación.

El proyecto fue desarrollado de manera colaborativa por un equipo de 4 estudiantes, donde cada integrante fue responsable de un módulo específico del sistema. La arquitectura modular permite que cada componente funcione de manera independiente mientras se integra perfectamente con los demás módulos para formar un sistema cohesivo y funcional.

---

## 🎯 OBJETIVO DEL PROYECTO

Desarrollar un sistema backend robusto que permita:

- Gestionar múltiples sedes de estacionamiento con diferentes tipos de espacios
- Permitir a usuarios registrarse, autenticarse y reservar espacios
- Controlar el acceso mediante códigos QR con seguridad
- Ofrecer diferentes modalidades de uso (reservas puntuales y pases mensuales)
- Gestionar la facturación y pagos del sistema

Todo esto aplicando **patrones de diseño** modernos, **principios SOLID** y las mejores prácticas de desarrollo con **Spring Boot**.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

El sistema está construido siguiendo una **arquitectura en capas** (Layered Architecture) y está dividido en **4 módulos independientes** que se comunican entre sí mediante una API REST unificada.

```
┌─────────────────────────────────────────────────────────────┐
│                   API REST UNIFICADA                        │
│                   Puerto: 8080                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼─────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│   MÓDULO 1:     │  │   MÓDULO 2:     │  │   MÓDULO 3:     │
│   Usuarios      │  │   Sedes y       │  │   Reservas,     │
│                 │  │   Espacios      │  │   Accesos y     │
│   Compañero 3   │  │   Diego H.      │  │   Pases         │
│                 │  │                 │  │   Santiago A.   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   MÓDULO 4:       │
                    │   Sistema         │
                    │   Financiero      │
                    │   Compañero 4     │
                    └───────────────────┘
```

**Stack Tecnológico:**
- Framework: Spring Boot 3.2.0
- Lenguaje: Java 17
- Arquitectura: REST API
- Persistencia: H2 Database (desarrollo)
- Build: Gradle 8.x
- Servidor: Tomcat embebido

---

## 📚 DOCUMENTACIÓN POR MÓDULO

El sistema está documentado de manera modular. Cada módulo cuenta con su propia documentación técnica completa que incluye: arquitectura, patrones de diseño aplicados, diagramas UML, endpoints REST y ejemplos de uso.

---

### 📘 MÓDULO 1: Usuarios y Autenticación

**Responsable:** Compañero 3

Este módulo gestiona todo lo relacionado con usuarios del sistema, desde el registro hasta la autenticación y autorización.

**🔗 [Ver documentación completa del Módulo de Usuarios](https://github.com/tu-repo/docs/MODULO-USUARIOS.md)**

**Funcionalidades principales:**
- Registro de nuevos usuarios
- Login con validación de credenciales
- Gestión de roles (ADMIN, USER)
- Seguridad con Spring Security
- Encriptación de contraseñas con BCrypt

**Tecnologías:** Spring Security, BCrypt, JWT (opcional)

---

### 📗 MÓDULO 2: Sedes y Espacios

**Responsable:** Diego Heredia

Este módulo administra la infraestructura física del sistema: las sedes de estacionamiento y los espacios disponibles en cada una.

**🔗 [Ver documentación completa del Módulo de Sedes y Espacios](https://github.com/tu-repo/docs/MODULO-SEDES-ESPACIOS.md)**

**Funcionalidades principales:**
- Gestión completa de sedes (CRUD)
- Gestión de espacios de estacionamiento
- 4 tipos de espacio: AUTO, MOTO, DISCAPACITADO, VIP
- Estados de espacio: DISPONIBLE, OCUPADO, RESERVADO, MANTENIMIENTO
- Creación masiva de espacios por sede
- Filtrado de disponibilidad con Strategy Pattern

**Patrones aplicados:** Simple Factory, Strategy Pattern

---

### 📙 MÓDULO 3: Reservas, Check-In/Out y Pases Mensuales

**Responsable:** Santiago Abuawad

Este es el módulo central del sistema, gestionando las reservas, el control de acceso y las suscripciones mensuales.

**🔗 [Ver documentación completa del Módulo de Reservas y Accesos](https://github.com/tu-repo/docs/MODULO-RESERVAS-ACCESOS.md)**

**Funcionalidades principales:**
- Sistema de reservas con validaciones de negocio
- Check-in/Check-out automatizado
- Generación de códigos QR seguros (SHA-256)
- 3 tipos de pases mensuales: BÁSICO, PREMIUM, EMPRESARIAL
- Cálculo dinámico de precios con Strategy Pattern
- Gestión de estados de reserva con máquina de estados

**Patrones aplicados:** Strategy Pattern, DTO Pattern, Mapper Pattern, Service Layer, Dependency Injection

**Casos de uso:** [Ver casos de uso detallados](https://github.com/tu-repo/docs/CASOS-DE-USO.md)

---

### 📕 MÓDULO 4: Sistema Financiero

**Responsable:** Compañero 4

Este módulo gestiona toda la parte económica del sistema: facturación, pagos y tarifas.

**🔗 [Ver documentación completa del Módulo Financiero](https://github.com/tu-repo/docs/MODULO-FINANCIERO.md)**

**Funcionalidades principales:**
- Generación automática de facturas
- Gestión de pagos y estados
- Sistema de tarifas dinámicas
- Reportes financieros
- Cálculo de montos según tipo de servicio

**Patrones aplicados:** Factory Pattern, Strategy Pattern, DTO Pattern

---

## 🎨 PATRONES DE DISEÑO

El proyecto implementa **8 patrones de diseño** reconocidos, aplicados estratégicamente en diferentes módulos según las necesidades específicas:

| Patrón | Módulo | Justificación |
|--------|--------|---------------|
| **Strategy** | Pases Mensuales | Cálculo dinámico de precios según tipo (Básico/Premium/Empresarial) |
| **Strategy** | Sedes/Espacios | Múltiples criterios de filtrado de disponibilidad |
| **Simple Factory** | Espacios | Creación consistente de espacios según tipo |
| **Factory** | Financiero | Generación de diferentes tipos de facturas |
| **DTO** | Todos | Separación clara entre capa de API y dominio |
| **Mapper** | Reservas/Pases | Conversión bidireccional Model ↔ DTO |
| **Service Layer** | Todos | Centralización de lógica de negocio |
| **Dependency Injection** | Todos | Inversión de control e inyección de dependencias |

**📄 [Ver justificación detallada de cada patrón](https://github.com/tu-repo/docs/JUSTIFICACION-PATRONES.md)**

---

## 📊 MÉTRICAS DEL PROYECTO

| Métrica | Valor |
|---------|-------|
| **Módulos** | 4 |
| **Endpoints REST** | 54+ |
| **Modelos de dominio** | 10+ |
| **Services** | 8+ |
| **Controllers** | 7+ |
| **Patrones de diseño** | 8 |
| **Líneas de código** | ~5,000 |
| **Casos de uso** | 20+ |

---

## 🚀 INSTALACIÓN Y EJECUCIÓN

### Requisitos
- Java 17 o superior
- Gradle 8.x
- Puerto 8080 disponible

### Ejecución
```bash
# Clonar repositorio
git clone [URL_DEL_REPO]

# Compilar
./gradlew clean build -x test

# Ejecutar
./gradlew bootRun
```

El servidor estará disponible en: `http://localhost:8080`

---

## 📖 DOCUMENTACIÓN ADICIONAL

- **[Casos de Uso Completos](https://github.com/tu-repo/docs/CASOS-DE-USO.md)** - Descripción detallada de todos los casos de uso
- **[Justificación de Patrones](https://github.com/tu-repo/docs/JUSTIFICACION-PATRONES.md)** - Explicación técnica de cada patrón aplicado
- **[Documentación API REST](https://github.com/tu-repo/docs/API-DOCUMENTACION.md)** - Especificación completa de endpoints
- **[Diagramas UML](https://github.com/tu-repo/docs/DIAGRAMAS-UML.md)** - Diagramas de clases de cada módulo

---

## 👥 EQUIPO DE DESARROLLO

| Estudiante | Módulo | Responsabilidades |
|------------|--------|-------------------|
| Compañero 3 | Usuarios y Autenticación | Registro, login, seguridad |
| Diego Heredia | Sedes y Espacios | Infraestructura, disponibilidad |
| Santiago Abuawad | Reservas y Accesos | Core del negocio, QR, pases |
| Compañero 4 | Sistema Financiero | Facturación, pagos, tarifas |

---

## 🎯 CONCLUSIÓN

Este sistema implementa una solución completa y profesional para la gestión de estacionamientos, aplicando:

- ✅ Arquitectura en capas bien definida
- ✅ 8 patrones de diseño aplicados correctamente
- ✅ Principios SOLID
- ✅ Código limpio y mantenible
- ✅ API REST completa y documentada
- ✅ 54+ endpoints funcionales
- ✅ Sistema de seguridad robusto

**Estado del proyecto:** ✅ Completado y funcional

---

**Última actualización:** Diciembre 2025
