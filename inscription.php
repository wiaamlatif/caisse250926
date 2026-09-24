<?php
session_start();
require_once './database.php';

$errorMessage = '';
$successMessage = '';
$firstName = '';
$lastName = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = trim((string) ($_POST['first_name'] ?? ''));
    $lastName = trim((string) ($_POST['last_name'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if ($firstName === '' || $lastName === '' || $password === '') {
        $errorMessage = 'Completer le formulaire S.V.P !';
    } elseif (mb_strlen($firstName) > 70 || mb_strlen($lastName) > 70 || strlen($password) < 8) {
        $errorMessage = 'Les informations saisies sont invalides.';
    } else {
        $check = $conn->prepare('SELECT id_user FROM users WHERE first_name = ? AND last_name = ? LIMIT 1');
        $check->bind_param('ss', $firstName, $lastName);
        $check->execute();
        $exists = $check->get_result()->fetch_assoc();
        $check->close();

        if ($exists) {
            $errorMessage = 'Un utilisateur avec ce nom existe déjà.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $role = 2;
            $approved = 0;
            $totalTickets = 0;
            $image = '';
            $insert = $conn->prepare('INSERT INTO users (first_name, last_name, role, approved, pwd, totalTickets, imgsrc) VALUES (?, ?, ?, ?, ?, ?, ?)');
            $insert->bind_param('ssiisis', $firstName, $lastName, $role, $approved, $hash, $totalTickets, $image);
            if ($insert->execute()) {
                $successMessage = 'Compte créé. Un administrateur doit maintenant l’accepter.';
                $firstName = '';
                $lastName = '';
            } else {
                $errorMessage = 'Erreur de connexion à la base de données.';
            }
            $insert->close();
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
    <title>Inscription</title>
</head>
<body class="bg-light">
<main class="container py-5" style="max-width: 520px;">
    <h1 class="mb-4">Inscription</h1>
    <?php if ($errorMessage !== ''): ?><div class="alert alert-danger" role="alert"><?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
    <?php if ($successMessage !== ''): ?><div class="alert alert-success" role="alert"><?= htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
    <form method="post" action="inscription.php">
        <div class="mb-3"><label class="form-label" for="first_name">First name</label><input class="form-control" id="first_name" name="first_name" maxlength="70" value="<?= htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') ?>" required></div>
        <div class="mb-3"><label class="form-label" for="last_name">Last name</label><input class="form-control" id="last_name" name="last_name" maxlength="70" value="<?= htmlspecialchars($lastName, ENT_QUOTES, 'UTF-8') ?>" required></div>
        <div class="mb-3"><label class="form-label" for="password">Password (8 caractères minimum)</label><input class="form-control" type="password" id="password" name="password" minlength="8" required></div>
        <button class="btn btn-primary" type="submit">S’inscrire</button>
        <a class="btn btn-link" href="connexion.php">Connexion</a>
    </form>
</main>
</body>
</html>
