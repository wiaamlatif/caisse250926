
<?php
  if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
  }

  $role = (int) ($_SESSION['user']['role'] ?? 0);
 
  $urlNav = array(
                   0 => "/index.php",//Products                   
                   1 => "/index.php",//Vente    
                   2 => "/admin_users.php",//Admin                
                   3 => "/deconnexion.php"//deconnexion
                );

  for ($i=0; $i < count($urlNav) ; $i++) { 
    $coloredNav[$i]="";
  }
  
  $clickedNav=array_search($_SERVER['PHP_SELF'],$urlNav);

  $coloredNav[$clickedNav]= "bg-primary text-white active";

?>

      <ul class="navbar-nav d-flex flex-row justify-content-center py-2 border border-0">

        <li class="nav-item">
          <a class="nav-link <?= $coloredNav[0] ?> px-3" aria-current="page" href="<?= $urlNav[0] ?>">Products</a>
        </li>

        <li class="nav-item">
          <a class="nav-link <?= $coloredNav[1] ?> px-3" href="<?= $urlNav[1] ?>">Vente</a>
        </li>

        <?php if($role==1){ ?>
        <li class="nav-item">
          <a class="nav-link <?= $coloredNav[2] ?> px-3" href="<?= $urlNav[2] ?>">Back Side</a>
        </li>        
        <?php } ?>

        <li class="nav-item">
          <a class="nav-link <?= $coloredNav[3] ?> px-3" href="<?= $urlNav[3] ?>">Deconnexion</a>
        </li>


      </ul>
                                  <!--   badge-pill badge-light         -->
      <div id="photoServer" class="badge  border border-success border-3 rounded-pill text-bg-light fs-6 fs-bold py-2 my-1"></div>

      

  



