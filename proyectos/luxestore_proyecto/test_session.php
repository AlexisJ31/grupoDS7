<?php

// Importar el modelo Rol para obtener las constantes de roles
require_once __DIR__ . '/models/Rol.php';

// Iniciar la sesión de PHP
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Obtener la acción a ejecutar
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'login_admin':
        // TODO: confirmar con J.J. el nombre exacto de la variable de sesión donde guarda el rol al loguear
        // TODO: confirmar con Alexander/Nicolas el nombre real de la columna de rol en la tabla usuarios
        
        // Simular inicio de sesión con el Rol de Administrador
        $_SESSION['user_role'] = Rol::ADMIN;
        // Redirigir directamente al panel del administrador
        header('Location: admin_dashboard.php');
        exit();

    case 'login_cliente':
        // Simular inicio de sesión con el Rol de Cliente (usuario común)
        $_SESSION['user_role'] = Rol::CLIENTE;
        // Redirigir a la pantalla de login para verificar su estado
        header('Location: login.php');
        exit();

    case 'logout':
        // Limpiar y destruir la sesión actual para simular el cierre de sesión
        unset($_SESSION['user_role']);
        session_destroy();
        header('Location: login.php');
        exit();

    default:
        // Si no se especifica acción, redirigir al login
        header('Location: login.php');
        exit();
}
