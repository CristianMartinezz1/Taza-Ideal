# ☕ Taza Ideal

Plataforma web full stack para cafeterías que ayuda a los clientes a descubrir qué bebida pedir mediante una encuesta personalizada de 6 preguntas, realizar pedidos en línea y recibir notificaciones automáticas por correo electrónico, SMS y WhatsApp cuando su orden está lista.

## 👥 Integrantes del equipo
* **Cristian Martínez Pacheco** — Base de datos, Backend (Spring Boot), Seguridad JWT, Notificaciones y Despliegue en VPS.
* **Hasiel Isai Mendoza Lucero** — Frontend (React), Diseño responsivo, Diagrama ER y Pruebas de API con Bruno.

## 🎯 Problema que resuelve
Muchos clientes no saben qué café elegir ante un menú amplio. **Taza Ideal** guía al usuario con una encuesta rápida de 6 preguntas sobre sus preferencias de sabor, temperatura e intensidad, recomendándole la bebida del menú con mayor coincidencia y permitiéndole ordenar en línea con seguimiento en tiempo real.

## 🔐 Roles del sistema
* **Cliente:** Registro con verificación de correo, encuesta de 6 preguntas, consulta de menú con filtros, carrito, creación y cancelación de pedidos, e historial.
* **Barista:** Visualización de pedidos del día con filtros y actualización de estados (`Pendiente` → `En preparación` → `Listo` → `Entregado`), disparando avisos por SMS y WhatsApp al marcar *Listo*.
* **Administrador:** Gestión completa (CRUD) de usuarios, productos (con fotografía), categorías y supervisión general de pedidos.

## 🛠️ Tecnologías utilizadas
* **Frontend:** React, Vite, React Router, Axios, CSS (Variables / Tokens del sistema de diseño).
* **Backend:** Java 21, Spring Boot, Spring Security + JWT, Spring Data JPA, Bean Validation, Flyway.
* **Base de datos:** MySQL.
* **Notificaciones y pruebas:** Postfix (Correo), Twilio (SMS y WhatsApp), Bruno (Colección de pruebas API).
* **Infraestructura:** VPS Linux, Nginx, systemd, HTTPS (Certbot).

## 🔗 Enlaces del proyecto
* **Prototipo en Figma:** *(Pegar enlace de presentación de Figma aquí)*
* **Tablero de GitHub Projects:** [Ver tablero Taza Ideal](https://github.com/users/CristianMartinezz1/projects/1)
* **Repositorio:** [CristianMartinezz1/Taza-Ideal](https://github.com/CristianMartinezz1/Taza-Ideal)