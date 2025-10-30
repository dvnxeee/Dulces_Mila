# Proyecto Full Stack E-Commerce: "Dulces Mila"

Este repositorio contiene el proyecto completo para la Experiencia 2, el cual consiste en una aplicación web Full Stack para la tienda de repostería "Dulces Mila".

La aplicación está dividida en dos componentes principales:
* **Backend (Spring Boot):** Una API RESTful que maneja la lógica de negocio, la seguridad (encriptación), la gestión de usuarios, el inventario de productos y las estadísticas.
* **Frontend (React):** Una aplicación de una sola página (SPA) que consume la API del backend y provee una interfaz de cliente (catálogo) y un panel de administración (Dashboard) para los vendedores.

---

## 2. Tecnologías Utilizadas

### Backend (`proyecto_backend`)
* Java 21
* Spring Boot 3
* Spring Data JPA (Hibernate)
* Spring Security (para encriptación de contraseñas con BCrypt)
* MySQL (Base de datos relacional)
* Lombok
* Swagger (SpringDoc) (para Documentación de API)
* Mockito (para Pruebas Unitarias)

### Frontend (`DULCES_MILA_FRONTEND`)
* React 18 (con Vite)
* React Router DOM (para enrutamiento)
* Axios (para consumo de API REST)
* Bootstrap 5 (para diseño y componentes)
* CSS3

---

## 3. Instrucciones de Instalación

Para correr este proyecto, necesitarás tener dos terminales abiertas (una para el backend y otra para el frontend).

### Backend (Spring Boot)

1.  **Base de Datos:** Asegúrate de tener un servidor MySQL corriendo (ej. XAMPP, MySQL Workbench).
2.  **Crear la Base de Datos:** Ejecuta el siguiente comando en tu gestor de MySQL:
    ```sql
    CREATE DATABASE dulces_mila;
    ```
3.  **Configurar Conexión:** Revisa el archivo `proyecto_backend/src/main/resources/application.properties`. Por defecto, está configurado para `root` sin contraseña. Ajusta `spring.datasource.username` y `spring.datasource.password` si es necesario.
4.  **Scripts (Opcional):** Los scripts de creación (`schema.sql`) y poblamiento (`import.sql`) están incluidos en la carpeta `resources/` (o en la carpeta `/sql` del repositorio). El proyecto está configurado con `ddl-auto=create-drop` (o `update`) y `import.sql` para poblarse automáticamente.

### Frontend (React)

1.  **Navegar:** Abre una terminal y sitúate en la carpeta `DULCES_MILA_FRONTEND`.
2.  **Instalar Dependencias:** Ejecuta el siguiente comando para instalar React, Axios, Bootstrap y otras dependencias:
    ```bash
    npm install
    ```

---

## 4. Instrucciones de Ejecución

### 1. Ejecutar el Backend (Servidor)

* Abre el proyecto `proyecto_backend` en tu IDE (ej. VS Code o IntelliJ).
* Ejecuta la clase principal `ProyectoBackendApplication.java`.
* El servidor se iniciará en `http://localhost:8080`.

### 2. Ejecutar el Frontend (Cliente)

* Abre una **segunda terminal** y sitúate en la carpeta `DULCES_MILA_FRONTEND`.
* Ejecuta el siguiente comando:
    ```bash
    npm run dev
    ```
* La aplicación se abrirá automáticamente en tu navegador en `http://localhost:5173`.

### 3. Documentación de la API (Swagger)

Una vez que el **backend** esté corriendo, puedes acceder a la documentación completa de la API en:

**[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

---

## 5. Credenciales de Prueba

El script de poblamiento (`import.sql` / `data.sql`) crea los siguientes usuarios por defecto:

### Administrador (SUPER_ADMIN)
* **Email:** `admin@mila.com`
* **Contraseña:** `admin123` *(Esta es la contraseña en texto plano. El hash correspondiente está en el script SQL)*.
* **Acceso:** Este usuario puede acceder al Dashboard en `/administrador`, pero (según nuestra lógica de negocio) la app lo redirigirá al Inicio (`/`) ya que no es `VENDEDOR`.

### Vendedor (VENDEDOR)
* **Email:** `dana.m@dulcesmila.com` (O el usuario que hayas creado con el rol VENDEDOR).
* **Contraseña:** (La que usaste al crearla, ej. `admin1234`).
* **Acceso:** Este es el rol principal de gestión. Al iniciar sesión, será redirigido al **Dashboard Administrativo** (`/administrador`).

### Cliente (CLIENTE)
* **Email:** `j.gonzales@gmail.com` (O crea uno nuevo en `/registro`).
* **Contraseña:** (La que corresponda del script SQL o del registro).
* **Acceso:** Este usuario será redirigido al Inicio (`/`) después de iniciar sesión.