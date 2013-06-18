<?php
require 'dbFoxy.inc';

$UploadDirectory    = 'db_backup/'; //Upload Directory, ends with slash & make sure folder exist
$SuccessRedirect    = 'https://localhost/WTD.html'; //Redirect to a URL after success

// replace with your mysql database details

/*
$user     = "xxx"; //mysql username
$password     = "xxx"; //mysql password
$server    = "localhost"; //hostname
$database = 'xxx'; //databasename
 */

if (!@file_exists($UploadDirectory)) {
    //destination folder does not exist
    die("Make sure Upload directory exists!");
}

if($_POST)
{
   if(!isset($_POST['mName']) || strlen($_POST['mName'])<1)
    {
        //required variables are empty
        die("Title is empty!");
    }


    if($_FILES['mFile']['error'])
    {
        //File upload error encountered
        die(upload_errors($_FILES['mFile']['error']));
    }

    $FileName           = strtolower($_FILES['mFile']['name']); //uploaded file name
    $FileTitle          = mysql_real_escape_string($_POST['mName']); // file title
    $FileExt            = substr($FileName, strrpos($FileName, '.')); //file extension
    $FileType           = $_FILES['mFile']['type']; //file type
    $FileSize           = $_FILES['mFile']["size"]; //file size
    $RandNumber         = rand(0, 9999999999); //Random number to make each filename unique.
    $uploaded_date      = date("Y-m-d H:i:s");

    if ((strtolower($FileExt)) !== ".sql")
    {        
            die('Unsupported File!' . $FileExt); //output error
    }


    //File Title will be used as new File name
    $NewFileName = preg_replace(array('/s/', '/.[.]+/', '/[^w_.-]/'), array('_', '.', ''), strtolower($FileTitle));
    $NewFileName = $NewFileName.'_'.$RandNumber.$FileExt;
    //Rename and save uploded file to destination folder.
    $sqlFile     = $UploadDirectory . $NewFileName;
    
    
    if(move_uploaded_file($_FILES['mFile']["tmp_name"], $sqlFile ))
    {
         if (!@file_exists($sqlFile)) {
            //destination folder does not exist
            die("Make sure " . $sqlFile. " exist!");
         }  

/*        $restore = "c:/xampp/mysql/bin/mysql -h $server -u root  $database < $sqlFile";        */
        $restore = "mysql -h $server -u $user  -p$password $database < $sqlFile"; 
        system($restore, $result);
   
        if ($result !== false) {  // $result == 0 == false == success             
            die('error restoring ' . $database . ' from file '. $sqlFile .' - error: ' . $result );
        }
    }else{
            die('error moving uploaded File to ' . $sqlFile );
    }   
}    

//function outputs upload error messages, http://www.php.net/manual/en/features.file-upload.errors.php#90522
function upload_errors($err_code) {
    switch ($err_code) {
        case UPLOAD_ERR_INI_SIZE:
            return 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
        case UPLOAD_ERR_FORM_SIZE:
            return 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
        case UPLOAD_ERR_PARTIAL:
            return 'The uploaded file was only partially uploaded';
        case UPLOAD_ERR_NO_FILE:
            return 'No file was uploaded';
        case UPLOAD_ERR_NO_TMP_DIR:
            return 'Missing a temporary folder';
        case UPLOAD_ERR_CANT_WRITE:
            return 'Failed to write file to disk';
        case UPLOAD_ERR_EXTENSION:
            return 'File upload stopped by extension';
        default:
            return 'Unknown upload error';
    }
}
?>