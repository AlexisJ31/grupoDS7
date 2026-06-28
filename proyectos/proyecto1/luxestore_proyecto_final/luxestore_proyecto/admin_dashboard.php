<?php

// Importar el controlador de administración
require_once __DIR__ . '/controllers/DashboardController.php';

/**
 * Punto de entrada para el Panel de Administración (Dashboard).
 * El constructor del controlador DashboardController se encarga de verificar
 * automáticamente si el usuario actual tiene los permisos correspondientes (Rol Admin).
 */
$controller = new DashboardController();

// Renderizar la página del dashboard
$controller->index();
