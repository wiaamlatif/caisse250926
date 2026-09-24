<?php  
  
  require_once './database.php';

  $sql = "SELECT * FROM users;";
          
  $result = mysqli_query($conn, $sql);

  $users = mysqli_fetch_all($result, MYSQLI_ASSOC);

  $arrayData = []; 
  foreach ($users as $user) {

    array_push($arrayData,$user); 

  } //foreach

  print_r(json_encode($arrayData));