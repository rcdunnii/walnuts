<?php 
    require 'dbFoxy.inc';    
    $dir = "db_backup";  
  //if the db directory doesn't exist yet, create it
    if (!is_dir($dir))
        mkdir($dir);  
    //create the file name for the backup (if you want to run the update more frequently than once a day, add more specificity to the date
    $backupfile = $dir.'/'.$database.'_'.date("m-d-Y_H-i-s").'.sql';   
    //make the system call to mysqldump
    exec("mysqldump --user=$user --password=$password --host=$server $database > $backupfile", $output, $result);           
    if ($result == 0) {
        header("Content-Description: File Transfer"); 
        header("Content-Type: application/octet-stream"); 
        header("Content-Disposition: attachment; filename=\"$backupfile\""); 
        readfile ($backupfile);
    } else {
        var_dump($output);
        echo "$backupfile unable to be created - error # $result";
    }    
?>