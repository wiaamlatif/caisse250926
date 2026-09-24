<?php
session_start();

if ((int) ($_SESSION['user']['role'] ?? 0) !== 1) {
    http_response_code(403);
    exit('Accès interdit.');
}

require_once './database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = (int) ($_POST['id_user'] ?? 0);
    $approve = (int) ($_POST['approved'] ?? 0) === 1 ? 1 : 0;
    $statement = $conn->prepare('UPDATE users SET approved = ? WHERE id_user = ? AND role <> 1');
    $statement->bind_param('ii', $approve, $userId);
    $statement->execute();
    $statement->close();
}

$result = $conn->query('SELECT id_user, first_name, last_name, approved FROM users WHERE role <> 1 ORDER BY approved ASC, last_name ASC');
$users = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Validation des utilisateurs</title>
</head>
<body class="bg-light">
<main class="container py-5">
    <h1 class="mb-4">Validation des utilisateurs</h1>
    <table class="table table-bordered bg-white">
        <thead><tr><th>First name</th><th>Last name</th><th>État</th><th>Action</th></tr></thead>
        <tbody>
        <?php foreach ($users as $user): ?>
            <tr>
                <td><?= htmlspecialchars($user['first_name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars($user['last_name'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= (int) $user['approved'] === 1 ? 'Accepté' : 'En attente' ?></td>
                <td>
                    <form method="post">
                        <input type="hidden" name="id_user" value="<?= (int) $user['id_user'] ?>">
                        <input type="hidden" name="approved" value="<?= (int) $user['approved'] === 1 ? 0 : 1 ?>">
                        <button class="btn btn-sm <?= (int) $user['approved'] === 1 ? 'btn-danger' : 'btn-success' ?>" type="submit">
                            <?= (int) $user['approved'] === 1 ? 'Refuser' : 'Accepter' ?>
                        </button>
                    </form>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</main>
</body>
</html>
