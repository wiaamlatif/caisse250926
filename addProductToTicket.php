<?php
   
if(isset($_GET['idProduct'])){

   $idProduct = $_GET['idProduct'];

}    

if(isset($_GET['idTicket'])){

   $idTicket = $_GET['idTicket'];

}  
  
//==========(Access to database)===============
require_once "./database.php";  
//=============================================

//================(1)==========================    
//get the next IndexRowTicket
$sql = " SELECT * FROM lignes_ticket
         INNER JOIN products ON lignes_ticket.id_product = products.id_product
         WHERE lignes_ticket.id_ticket = $idTicket
         ORDER BY lignes_ticket.indexRowTicket DESC LIMIT 1 ;";

$result = mysqli_query($conn, $sql);

$rowlignes_ticket = mysqli_fetch_assoc($result);


if($result && mysqli_num_rows($result) > 0) {
    // There are existing rows in the lignes_ticket

    $indexRowTicket = $rowlignes_ticket['indexRowTicket'];
$nameProduct = $rowlignes_ticket['name_product'];
     $imgSrc = $rowlignes_ticket['imgSrc'];
      $price = $rowlignes_ticket['price'];
   $quantity = $rowlignes_ticket['quantity']; 


} else {
    // No existing rows, start with index 0
    $indexRowTicket = 0;

}

$indexRowTicket++;

     
//=================================================== 
$sql= "INSERT INTO `lignes_ticket` (`id_ticket`,`id_product`,`indexRowTicket`,`quantity`)
                             VALUES('$idTicket','$idProduct','$indexRowTicket' , '1' );";

$result = mysqli_query($conn,$sql);

$lastId = mysqli_insert_id($conn);       

//================(3) ============================
//>> update the "total_ticket" in the "tickets" table    
$sql = " SELECT SUM(products.price*lignes_ticket.quantity) as totalTicket FROM lignes_ticket
         INNER JOIN products ON lignes_ticket.id_product = products.id_product
         WHERE lignes_ticket.id_ticket = $idTicket;";
            
$result = mysqli_query($conn, $sql);

$productLignes_ticket = mysqli_fetch_assoc($result);

$totalTicket = $productLignes_ticket['totalTicket'];

$sql=" UPDATE  `tickets`
          SET   total_ticket = $totalTicket 
        WHERE      id_ticket = $idTicket;";

$result = mysqli_query($conn, $sql); 

//================(5)=======================
$sql = " SELECT * FROM lignes_ticket      
         INNER JOIN tickets       ON tickets.id_ticket  = lignes_ticket.id_ticket
         INNER JOIN users         ON tickets.id_user  = users.id_user
         INNER JOIN products      ON products.id_product = lignes_ticket.id_product
         INNER JOIN categories    ON categories.id_category = products.id_category        
         WHERE lignes_ticket.id_ticket  = $idTicket
         ORDER BY `id_ligne_ticket` DESC LIMIT 1;";
            
$result = mysqli_query($conn, $sql);

$lastLineTicket = mysqli_fetch_assoc($result);

$idLigneTicket  = $lastLineTicket['id_ligne_ticket'];
$imgSrc         = $lastLineTicket['imgSrc'];
$indexRowTicket = $lastLineTicket['indexRowTicket'];
$nameProduct    = $lastLineTicket['name_product'];
$nameProduct    = $lastLineTicket['name_product'];
$price          = $lastLineTicket['price'];

// data to send to the front-end 
$arrayData = ['idLigneTicket' => $idLigneTicket,
                   'idTicket' => $idTicket,
                  'idProduct' => $idProduct,
                     'imgSrc' => $imgSrc,
                      'index' => $indexRowTicket,
                'nameProduct' => $nameProduct,
                   'quantity' => '1',
                      'price' => $price];


print_r(json_encode($arrayData));