<?php
session_start();

if (isset($_SESSION['user']['id_user'])) {
    header('Location: scrollTickets.php');
    exit;
}

require_once './database.php';

$errorMessage = '';
$oldFirstName = '';
$oldLastName = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $oldFirstName = trim((string) ($_POST['first_name'] ?? ''));
    $oldLastName = trim((string) ($_POST['last_name'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if ($oldFirstName === '' || $oldLastName === '' || $password === '') {
        $errorMessage = 'Completer le formulaire S.V.P !';
    } else {

        $sql = 'SELECT id_user, first_name, last_name, role, pwd, approved FROM users 
                 WHERE first_name = ? AND last_name = ? 
                 LIMIT 1';
               
        $statement = $conn->prepare($sql);

        if (!$statement) {
            $errorMessage = 'Erreur de connexion à la base de données.';
        } else {
            $statement->bind_param('ss', $oldFirstName, $oldLastName);
            $statement->execute();
            $user = $statement->get_result()->fetch_assoc();
            $statement->close();

            $passwordIsValid = $user && password_verify($password, $user['pwd']);
            $legacyPasswordIsValid = $user && hash_equals((string) $user['pwd'], $password);

            if (!$passwordIsValid && !$legacyPasswordIsValid) {
                $errorMessage = 'Login ou mot de passe incorrects !';
            } elseif ((int) $user['approved'] !== 1) {
                $errorMessage = 'Login ou mot de passe incorrects !';
            } else {
                if ($legacyPasswordIsValid) {
                    $newHash = password_hash($password, PASSWORD_DEFAULT);
                    $update = $conn->prepare('UPDATE users SET pwd = ? WHERE id_user = ?');
                    $update->bind_param('si', $newHash, $user['id_user']);
                    $update->execute();
                    $update->close();
                }

                session_regenerate_id(true);
                $_SESSION['user'] = [
                                       'id_user' => (int) $user['id_user'],
                                    'first_name' => $user['first_name'],
                                     'last_name' => $user['last_name'],
                                          'role' => (int) $user['role']
                                    ];
                header('Location: scrollTickets.php');
                exit;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Connexion</title>
</head>
<body class="bg-light">
<main class="container py-5" style="max-width: 520px;">
    <h1 class="mb-4">Connexion</h1>
    <?php if ($errorMessage !== ''): ?>
        <div class="alert alert-danger" role="alert"><?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>
    <form method="post" action="connexion.php" novalidate>
        <div class="mb-3">
            <label class="form-label" for="first_name">First name</label>
            <input class="form-control" id="first_name" name="first_name" maxlength="70" value="<?= htmlspecialchars($oldFirstName, ENT_QUOTES, 'UTF-8') ?>" required>
        </div>
        <div class="mb-3">
            <label class="form-label" for="last_name">Last name</label>
            <input class="form-control" id="last_name" name="last_name" maxlength="70" value="<?= htmlspecialchars($oldLastName, ENT_QUOTES, 'UTF-8') ?>" required>
        </div>
        <div class="mb-3">
            <label class="form-label" for="password">Password</label>
            <input class="form-control" type="password" id="password" name="password" required>
        </div>
        <button class="btn btn-primary" type="submit">Se connecter</button>
        <a class="btn btn-link" href="inscription.php">Créer un compte</a>
    </form>
</main>
</body>
</html>
