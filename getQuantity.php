<?php
    
    if(isset($_GET['idTicket'])){

        $idTicket = $_GET['idTicket'];

    }    
    
    if(isset($_GET['idLigneTicket'])){

        $idLigneTicket = $_GET['idLigneTicket'];  

    }

    if(isset($_GET['plusMinus'])){

        $plusMinus = $_GET['plusMinus']; 

    }
   
  require_once './database.php';
  
//======================================================
////////////( quantity in "lignes_ticket" )///////////// 
//======================================================

  $sql="SELECT quantity, price
          FROM lignes_ticket 
        INNER JOIN products ON products.id_product = lignes_ticket.id_product
         WHERE id_ligne_ticket = $idLigneTicket;";
                      
  $result = mysqli_query($conn, $sql);

  $QuantityPrice = mysqli_fetch_assoc($result);

  $currentQuantity = (int) $QuantityPrice['quantity']; 
  $currentPrice = (float) $QuantityPrice['price'];

  //Modify Quantity of the idLigneTicket
  if( $plusMinus == 1){

    if($currentQuantity<100){
        $currentQuantity= $currentQuantity + 1;
    }

  }  elseif ($plusMinus == 0) {

    if($currentQuantity>1){
        $currentQuantity= $currentQuantity - 1;
    }

  }
  
  //Update Quantity of the idLigneTicket
  if($currentQuantity>0){

    $sql="UPDATE lignes_ticket
             SET quantity = $currentQuantity                                                      
           WHERE id_ligne_ticket  = $idLigneTicket ;";

  } else {
    $sql ="DELETE FROM lignes_ticket 
                  WHERE id_ligne_ticket=$idLigneTicket;";
  } 
  
  $result = mysqli_query($conn, $sql); 


//=====================================================
////////////( total_ticket in "tickets" )///////////// 
//====================================================

  // Calcul sum ticket from lignes_ticket
  $sql="SELECT SUM(price * quantity) as totalTicket FROM lignes_ticket
        INNER JOIN products ON products.id_product = lignes_ticket.id_product
             WHERE id_ticket= $idTicket;";

  $result = mysqli_query($conn, $sql); 
  $totalCurrentTicket = mysqli_fetch_assoc($result);
  
  $totalTicket=0;
  if($totalCurrentTicket!=null){

  $totalTicket = $totalCurrentTicket['totalTicket'];

  }

   // Update total_ticket
  $sql=" UPDATE  `tickets`
            SET   total_ticket = $totalTicket               
          WHERE   id_ticket   = $idTicket;";

  $result = mysqli_query($conn, $sql); 

 
  $arrayData=[
        'quantity' => $currentQuantity,
           'price' => $currentPrice,
    'total_ticket' => $totalTicket  
  ];
  
  print_r(json_encode($arrayData));

?>