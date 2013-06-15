<?php

function restoreDBs(sql) {
    require 'dbFoxy.inc';
    
    exec("mysql < sql;", $output, $result);
    
    if ($result == 0) {           
       echo ("Restored Walnuts DB's!");
    } else {
        echo ("Restore failed with error # ". $result);
    }
 }
 
?> 