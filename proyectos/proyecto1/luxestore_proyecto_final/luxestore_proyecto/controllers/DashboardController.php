<?php

// Requerir el modelo de Rol para poder ejecutar la validación
require_once __DIR__ . '/../models/Rol.php';

/**
 * Clase DashboardController
 * Controlador encargado de gestionar las acciones del panel de administración.
 */
class DashboardController {
    
    /**
     * Constructor del controlador.
     * Ejecuta la verificación del rol administrador antes de que se procese
     * cualquier acción dentro de este controlador.
     */
    public function __construct() {
        // Validación de seguridad para restringir el acceso a administradores
        Rol::verificarRolAdmin();
    }

    /**
     * Acción principal.
     * Muestra la interfaz de usuario (vista) del panel de administración.
     */
    public function index() {
        // En la versión final, cargará la vista dinámicamente o incluirá la plantilla PHP de Lohnard
        // TODO: integrar con la vista final del dashboard creada por Lohnard (views/admin.php o similar)
        
        echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Panel de Administración - LUXE STORE</title>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f6f9; color: #333; margin: 0; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #111; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; }
        .alert-success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .role-badge { display: inline-block; background-color: #007bff; color: #fff; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
        a { color: #007bff; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        .logout-btn { display: inline-block; margin-top: 20px; background-color: #dc3545; color: #fff; padding: 10px 15px; border-radius: 4px; text-decoration: none; }
        .logout-btn:hover { background-color: #c82333; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='alert-success'>
            <strong>¡Acceso Autorizado!</strong> Has ingresado correctamente como Administrador.
        </div>
        <h1>LUXE STORE - Dashboard de Administración</h1>
        <p>Bienvenido al panel de control exclusivo para administradores.</p>
        <p>Tu rol de sesión actual es: <span class='role-badge'>" . htmlspecialchars($_SESSION['user_role']) . "</span></p>
        
        <p><a href='index.html'>Ir al inicio de la tienda (Estático)</a></p>
        
        <a href='test_session.php?action=logout' class='logout-btn'>Cerrar sesión de prueba</a>
    </div>
</body>
</html>";
    }
}
