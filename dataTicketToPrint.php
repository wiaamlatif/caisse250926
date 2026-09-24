<?php
if(isset($_GET['idTicket'])){

    $idTicket = $_GET['idTicket'];     
}

//=============================================
  require_once './database.php';
//=============================================
   //>> Get nrTicketSelected
         $sql = "SELECT * FROM tickets
                    INNER JOIN users   ON tickets.id_user  = users.id_user 
                         WHERE tickets.id_ticket  = $idTicket";    
            
   $result = mysqli_query($conn, $sql);

   $theTicket = mysqli_fetch_assoc($result);

   if($theTicket!=null ){
            $nrTicket = $theTicket['nr_ticket'];        
         $totalTicket = $theTicket['total_ticket'];                       
           $idVendeur = $theTicket['id_user']; 
         $nameVendeur = $theTicket['first_name'];               
   } 

$infoTicket = [  "idVendeur" => $idVendeur,
               "nameVendeur" => $nameVendeur,
                  "nrTicket" => $nrTicket,
               "totalTicket" => $totalTicket
               ]; 

$arrayTicket=[];               
array_push($arrayTicket,$infoTicket);  

 
//>> feed new items of the new ticket=cart
$sql = "SELECT * FROM lignes_ticket
INNER JOIN tickets       ON tickets.id_ticket  = lignes_ticket.id_ticket
INNER JOIN products      ON products.id_product = lignes_ticket.id_product
INNER JOIN categories    ON categories.id_category = products.id_category
WHERE tickets.id_ticket  = $idTicket";    
            
$result = mysqli_query($conn, $sql);
            
$detailTiket = mysqli_fetch_all($result, MYSQLI_ASSOC);        
                    
if(!empty($detailTiket)){ 

    //>> Find detailTiket from lignes_ticket
    foreach ($detailTiket as $lineTicket){ 
            
        $nameProduct=$lineTicket['name_product'];
        $quantity=$lineTicket['quantity'];
        $price=$lineTicket['price'];

        $totalItem=$quantity * $price; 
                    
        $rowTicket = [                                                             
                        "name_product" => $nameProduct,
                            "quantity" => $quantity,
                                "price" => $price,
                            "totalItem" => $totalItem ]; 
    
        array_push($arrayTicket,$rowTicket);  

    }//foreach

} //if(!empty($detailTiket)){ 

print_r(json_encode($arrayTicket));    

?>