<?php
session_start();

if (!isset($_SESSION['user']['id_user'])) {
    header('Location: connexion.php');
    exit;
}

$idUser = (int) $_SESSION['user']['id_user'];
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

    if(isset($_GET['idUser'])){

        $requestedUserId = (int) $_GET['idUser'];
        if ($requestedUserId === $idUser && $requestedUserId > 0) {
            $idUser = $requestedUserId;            
        }

    }

    if(isset($_GET['idTicket'])){

        $idTicket = (int) $_GET['idTicket'];

    }    


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">  
    <link rel="stylesheet" href="/asset/css/style.css">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <title>Home</title>
</head>
<body>

    
    <div class="container text-center mx-0">

        <div class="d-flex flex-row justify-content-center align-items-start gap-2 mt-3">
    
            <!---------(/uploads/employees/6780d515c22b9default_employe.png)--------------->
            <div id="photoServer" class="badge border border-success border-5 rounded-pill text-bg-light fs-6 fs-bold py-2 my-1 col-md-4 mx-4 ">
                <div class="d-flex flex-column justify-content-center align-items-center gap-2 mt-3">
                <img id="idImgUser" class="img img-fluid" src="" style="width:100px;">
                <span id="idSpanFirstName" class="badge badge-pill text-bg-success fst-italic fw-normal fs-5"></span> 
                </div>
            </div>                                                   

            <div class="d-flex flex-column justify-content-center align-items-center gap-2 mt-3">

                <div>
                   <span id ="displayTime" class="badge rounded-pill text-bg-primary fs-4 fs-bold py-2 my-1"></span> 
                </div>

                <div class="col">
                    <?php include './nav.php'; ?> 
                </div>
                
                <!--div class="col" -->
                <div class="btn-group gap-1 text text-nowrap" role="group" aria-label="Basic radio toggle button group">

                    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
                    <label class="btn btn-outline-primary rounded" for="btnradio1"><span>List Users</span></label>

                    <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
                    <label class="btn btn-outline-primary rounded " for="btnradio2"><span>List Tickets</span></label>

                    <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
                    <label class="btn btn-outline-primary rounded" for="btnradio3"><span>Edit a Ticket</span></label>

                    <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off">
                    <label class="btn btn-outline-primary rounded" for="btnradio4"><span>Products</span></label>            

                </div>
               
            </div><!-----(class="d-flex flex-column justify-content-center align-items-center gap-2 mt-3")------->      

        </div><!--------(class="d-flex flex-row justify-content-center align-items-start gap-2 mt-3")--------->

        <div class="d-flex flex-row justify-content-center align-items-start gap-2 mt-3">

            <div class="col col-3" id="divTab2">
                <table id="idTable2" class="table-2 table-striped table-sm table-border border-1 caption-top table-hover" data-id="2">
                </table>                         
            </div> 

            <div class="col col-3" id="divTab3">
                <table id="idTable3" class="table-3 table-striped table-sm caption-top table-hover" data-id="3">  

                </table>                                    
            </div>                        

            <div class="col col-4" id="divTab4">
                <table id="idTable4" class="table-4 table-striped table-sm caption-top table-hover" data-id="4">
                </table>                                                                                   
            </div>                            

        </div> <!----(class="d-flex flex-row justify-content-center align-items-start gap-2 mt-3")-----> 

    </div><!----------(class="container text-center mx-0")----------------->
    
    <script src=".\asset\js\test.js"></script>

    <script>

        document.addEventListener('DOMContentLoaded', function () {            
        
            scrollTickets(<?=$idUser?>,<?=$idTicket?>);            
            initKeyboardNavigation();
        });//addEventListener   

       
    
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script> 

</body>
</html> 


