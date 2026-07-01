<?php

require_once __DIR__ . '/Database.php';

class User
{
    public static function register(string $nombre, string $email, string $password): array
    {
        $db = Database::getConnection();

        $existing = self::getByEmail($email);
        if ($existing) {
            throw new RuntimeException('El correo ya está registrado');
        }

        $hash  = password_hash($password, PASSWORD_BCRYPT);
        $token = bin2hex(random_bytes(32));

        $stmt = $db->prepare('
            INSERT INTO usuarios (nombre, email, password_hash, auth_token)
            VALUES (:nombre, :email, :hash, :token)
        ');
        $stmt->execute([
            ':nombre' => $nombre,
            ':email'  => $email,
            ':hash'   => $hash,
            ':token'  => $token,
        ]);

        return [
            'id'    => (int) $db->lastInsertId(),
            'nombre' => $nombre,
            'email' => $email,
            'token' => $token,
            'rol'   => 'cliente',
        ];
    }

    public static function login(string $email, string $password): array
    {
        $user = self::getByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new RuntimeException('Credenciales inválidas');
        }

        $token = bin2hex(random_bytes(32));
        $db    = Database::getConnection();
        $stmt  = $db->prepare('UPDATE usuarios SET auth_token = :token WHERE id = :id');
        $stmt->execute([':token' => $token, ':id' => $user['id']]);

        return [
            'id'     => (int) $user['id'],
            'nombre' => $user['nombre'],
            'email'  => $user['email'],
            'token'  => $token,
            'rol'    => $user['rol'] ?? 'cliente',
        ];
    }

    public static function validateToken(string $token): ?array
    {
        $db   = Database::getConnection();
        $stmt = $db->prepare('SELECT id, nombre, email, rol FROM usuarios WHERE auth_token = :token');
        $stmt->execute([':token' => $token]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function getByEmail(string $email): ?array
    {
        $db   = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM usuarios WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
