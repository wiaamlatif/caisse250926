<?php
  require_once './database.php';

  $idCategory = filter_input(INPUT_GET, 'idCategory', FILTER_VALIDATE_INT);
  $categoryCondition = $idCategory === false || $idCategory === null
    ? ''
    : ' WHERE products.id_category = ' . $idCategory;

  // An omitted category loads the complete product catalogue.
  $sql = "SELECT products.*, categories.name_category
          FROM products
          INNER JOIN categories ON categories.id_category = products.id_category
          $categoryCondition
          ORDER BY products.id_category, products.id_product";
                      
  $result = mysqli_query($conn,$sql);

  $productsCategory = mysqli_fetch_all($result, MYSQLI_ASSOC);

  $arrayData = [];
  foreach ($productsCategory as $productCategory) {

    array_push($arrayData,$productCategory); 

  } //foreach

 
  print_r(json_encode($arrayData));

  
   
   
   
