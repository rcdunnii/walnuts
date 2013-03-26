<?php
    session_start();
    
    if (isset($_SESSION["isLoggedIn"]) && ($_SESSION["isLoggedIn"] == true)) {
        echo "true";
    } else {
        echo "false";
    }
?>