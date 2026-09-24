<?php

if(isset($_GET['idTicket'])){

$idTicket = $_GET['idTicket'];

}    

require_once "./database.php";

//>> Get produits       
$sql = "DELETE FROM `lignes_ticket` 
        WHERE `id_ticket`=$idTicket;";

$result = mysqli_query($conn,$sql);        

$sql=" UPDATE  `tickets`
          SET   total_ticket = 0
        WHERE   id_ticket   = $idTicket;";

$result = mysqli_query($conn, $sql);

$arrayData=[

            ];

print_r(json_encode($arrayData));                                       
