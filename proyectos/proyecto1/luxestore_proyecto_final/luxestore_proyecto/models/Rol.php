<?php

/**
 * Clase Rol
 * Define las constantes de roles disponibles en el e-commerce LUXE STORE
 * y proporciona métodos de validación de permisos.
 */
class Rol {
    // Constantes para identificar los roles del sistema
    public const ADMIN = 'admin';
    public const CLIENTE = 'cliente';

    /**
     * Verifica si el usuario actual en sesión tiene el rol de Administrador.
     * Si no tiene una sesión activa o su rol no es administrador,
     * se le redirige automáticamente a la pantalla de inicio de sesión.
     */
    public static function verificarRolAdmin() {
        // Asegurar que la sesión esté activa para poder leer las variables de sesión
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // TODO: confirmar con J.J. el nombre exacto de la variable de sesión donde guarda el rol al loguear
        // TODO: confirmar con Alexander/Nicolas el nombre real de la columna de rol en la tabla usuarios
        
        // Validamos si la variable de rol está definida en la sesión y si corresponde a ADMIN
        if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== self::ADMIN) {
            // Si el rol no es válido o no es administrador, redirige al login con parámetro de acceso denegado
            header('Location: login.php?error=acceso_denegado');
            exit();
        }
    }
}
