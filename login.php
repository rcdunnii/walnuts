<?php

define("ERR_INVALID_PASSWORD", "1");
define("ERR_DIFFERENT_PASSWORDS", "2");

$errors = array ();

/* comment out - don't need this for this function - we only have two users, 'user' and 'admin'
if (isset ($_POST["userName"])) {
    $username = $_POST["userName"];
    $len = strlen ($username);
    if ($len < 2 || $len > 20) {
        array_push ($errors, ERR_INVALID_USERNAME);
    }
    else {
            // check the name of registered users
        if (strcasecmp ($username, "Dottoro") == 0) {
            array_push ($errors, ERR_EXISTING_USERNAME);
        }
    }
}
else {
    array_push ($errors, ERR_INVALID_USERNAME);
}
*/

if (isset ($_POST["password"])) {
    $password = $_POST["password"];
    $len = strlen ($password);
    if ($len < 6 || $len > 10) {
        array_push ($errors, ERR_INVALID_PASSWORD);
    }
    else {
        if (!isset ($_POST["repassword"]) || strcmp ($password, $_POST["repassword"]) != 0) {
            array_push ($errors, ERR_DIFFERENT_PASSWORDS);
        }
    }
}
else {
    array_push ($errors, ERR_INVALID_PASSWORD);
}

$response = "";
if (sizeof ($errors) > 0) {
    $response = implode (",", $errors);
}
else {
        // some db operations, save username and password ...PUT db operations here
    
    $response = "ok";
}
    // 2 secs delay
sleep (2);

echo ($response);
?>