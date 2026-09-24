<?php
//  var_dump($_GET['idTicket']) ;

    $idTicket = $_GET['idTicket'];

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

            <div class="col col-5" id="divTab4">
                <table id="idTable4" class="table-4 table-striped table-sm caption-top table-hover" data-id="4">
                </table>                                                                                   
            </div>                            


            <div class="col col-7" id="divTab5">
                <table id="idTable5" class="table-5" data-id="5">
                </table>                                    
            </div>            

        </div>  

    </div>
    
    <script src=".\asset\js\test.js"></script>

    <script>

        document.addEventListener('DOMContentLoaded', function () {
            
            changeTicket("<?= $idTicket ?>");            
            initKeyboardNavigation();

        });//addEventListener   

    
    </script>

    

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script> 

</body>
</html> 


