<?php
session_start();


$idUser = isset($_GET['idUser']) ? (int)$_GET['idUser'] : 0;

if (!isset($_SESSION['user']['id_user'])) {
    http_response_code(401);
    exit;
}

$sessionUserId = (int) $_SESSION['user']['id_user'];
if ($idUser <= 0 || $idUser !== $sessionUserId) {
    $idUser = $sessionUserId;
}


require_once './database.php';

$sql = 'SELECT * FROM tickets 
    INNER JOIN users ON tickets.id_user = users.id_user 
         WHERE tickets.id_user = ? 
      ORDER BY id_ticket ASC'; 
       

$statement = $conn->prepare($sql);
$statement->bind_param('i', $idUser);
$statement->execute();
$result = $statement->get_result();

$userTickets = mysqli_fetch_all($result, MYSQLI_ASSOC);

$arrayData = [];
foreach ($userTickets as $userTicket) {

    array_push($arrayData, $userTicket);
}

print_r(json_encode($arrayData));