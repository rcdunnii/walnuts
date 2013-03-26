<?php
    session_start();
 
    if (!isset($_SESSION["isLoggedIn"])) {
        echo "false";
    } else {
        echo "true";
    }        
    return;
?>