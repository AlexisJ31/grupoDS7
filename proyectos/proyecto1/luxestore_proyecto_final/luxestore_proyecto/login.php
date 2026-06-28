<?php
// Asegurar que la sesión esté iniciada para poder interactuar con las variables del sistema
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Control de mensajes de error de acceso
$errorMsg = '';
if (isset($_GET['error']) && $_GET['error'] === 'acceso_denegado') {
    $errorMsg = 'Acceso Denegado: No tienes permisos de administrador para ingresar a esa sección.';
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - LUXE STORE</title>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f6f9; color: #333; margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
        .login-card { max-width: 450px; width: 100%; background: #fff; padding: 35px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
        h1 { font-size: 24px; color: #111; text-align: center; margin-bottom: 25px; }
        .alert-error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; padding: 12px 15px; border-radius: 4px; margin-bottom: 20px; font-size: 14px; text-align: center; }
        .info-box { background-color: #e2e3e5; border-color: #d6d8db; color: #383d41; padding: 15px; border-radius: 4px; margin-top: 25px; font-size: 13px; }
        .btn { display: block; width: 100%; text-align: center; padding: 12px; margin-bottom: 10px; border-radius: 4px; font-weight: bold; text-decoration: none; border: none; cursor: pointer; transition: background-color 0.2s; box-sizing: border-box; }
        .btn-admin { background-color: #007bff; color: white; }
        .btn-admin:hover { background-color: #0056b3; }
        .btn-client { background-color: #6c757d; color: white; }
        .btn-client:hover { background-color: #545b62; }
        .btn-clear { background-color: #e2e3e5; color: #333; }
        .btn-clear:hover { background-color: #d6d8db; }
        a.back-link { display: block; text-align: center; margin-top: 20px; color: #007bff; text-decoration: none; font-size: 14px; }
        a.back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="login-card">
        <h1>LUXE STORE - Iniciar Sesión</h1>
        
        <?php if (!empty($errorMsg)): ?>
            <div class="alert-error">
                <?php echo htmlspecialchars($errorMsg); ?>
            </div>
        <?php endif; ?>

        <!-- TODO: confirmar con J.J. el nombre exacto de la variable de sesión donde guarda el rol al loguear -->
        <!-- TODO: confirmar con Alexander/Nicolas el nombre real de la columna de rol en la tabla usuarios -->
        
        <p style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #666;">
            Esta es una pantalla de login provisional (mock). Utiliza los botones de abajo para simular el inicio de sesión y probar las restricciones de rol.
        </p>

        <a href="test_session.php?action=login_admin" class="btn btn-admin">Simular Sesión como ADMIN</a>
        <a href="test_session.php?action=login_cliente" class="btn btn-client">Simular Sesión como CLIENTE</a>
        <a href="test_session.php?action=logout" class="btn btn-clear">Cerrar Sesión Actual</a>

        <div class="info-box">
            <strong>Estado actual del sistema de sesión:</strong><br>
            Rol guardado: <code><?php echo isset($_SESSION['user_role']) ? htmlspecialchars($_SESSION['user_role']) : 'Ninguno (Sesión Cerrada)'; ?></code>
            <br><br>
            <a href="admin_dashboard.php" style="color: #007bff; font-weight: bold;">Intentar ingresar al Dashboard Admin</a>
        </div>

        <a href="index.html" class="back-link">Volver a la Tienda (Estático)</a>
    </div>
</body>
</html>
