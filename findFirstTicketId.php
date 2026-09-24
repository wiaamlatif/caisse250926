<?php
    session_start();

    if(isset($_GET['idUser'])){

        $idUser = (int) $_GET['idUser'];

        $_SESSION['user']['id_user'] = $idUser;

    }


$idTicket = 0;

require_once './database.php';

$sql = 'SELECT id_ticket FROM tickets 
         WHERE id_user = ? 
      ORDER BY id_ticket ASC LIMIT 1';

$ticketStatement = $conn->prepare($sql);
$ticketStatement->bind_param('i', $idUser);
$ticketStatement->execute();
$ticketStatement->bind_result($firstTicketId);
if ($ticketStatement->fetch()) {
    $idTicket = (int) $firstTicketId;
}
$ticketStatement->close();

print_r(json_encode($idTicket));


?>

