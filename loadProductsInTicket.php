<?php

    if(isset($_GET['idTicket'])){

        $idTicket = $_GET['idTicket'];
  
    }  
    
//=============================================
require_once './database.php';
//=============================================

//>> Store Lines current ticket in arrayData    
$sql = "SELECT * FROM lignes_ticket      
        INNER JOIN tickets       ON tickets.id_ticket  = lignes_ticket.id_ticket
        INNER JOIN users         ON tickets.id_user  = users.id_user
        INNER JOIN products      ON products.id_product = lignes_ticket.id_product
        INNER JOIN categories    ON categories.id_category = products.id_category        
        WHERE lignes_ticket.id_ticket  = $idTicket
        ORDER BY   products.id_product  ASC;
        ";    
            
$result = mysqli_query($conn, $sql);
            
$linesTicket = mysqli_fetch_all($result, MYSQLI_ASSOC);        

$arrayData=[];
foreach ($linesTicket as $ligneTicket){ 

    array_push($arrayData,$ligneTicket);

}//foreach

print_r(json_encode($arrayData));