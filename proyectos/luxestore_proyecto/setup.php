<?php
require_once __DIR__ . '/config/database.php';

echo "<h1>Auto-Instalador de Base de Datos</h1>";

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$sql_schema = file_get_contents(__DIR__ . '/config/schema.sql');
$sql_seed = file_get_contents(__DIR__ . '/config/seed.sql');

if (!$sql_schema || !$sql_seed) {
    die("No se pudieron leer los archivos SQL.");
}

echo "Ejecutando schema.sql...<br>";
if ($conn->multi_query($sql_schema)) {
    do {
        if ($res = $conn->store_result()) {
            $res->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    echo "¡Schema instalado con éxito!<br>";
} else {
    echo "Error en schema: " . $conn->error . "<br>";
}

echo "Ejecutando seed.sql...<br>";
if ($conn->multi_query($sql_seed)) {
    do {
        if ($res = $conn->store_result()) {
            $res->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    echo "¡Datos semilla (seed) insertados con éxito!<br>";
} else {
    echo "Error en seed: " . $conn->error . "<br>";
}

$conn->close();
echo "<h2>¡Listo! Ya puedes regresar a tu tienda.</h2>";
