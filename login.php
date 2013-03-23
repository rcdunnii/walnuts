<?php 
    session_start();

    $response = "";
    
    if (!($_POST['value'])) {
        echo 'Error: No data posted to login.php';			
        return FALSE;
    }
 
    
    $str_json = json_decode($_POST['value'], true);

    
//    $username = 'Walnut';   DELETE THIS COMMENT ONCE CODE IS WORKING
//    $password = 'Polky';    DELETE THIS COMMENT ONCE CODE IS WORKING
//    get stored password for aunthenticated user from hash table
    require 'db.inc';
		
	$mysqli = @ new mysqli($server, $user, $password, $database);
	
	/* check connection */
	if ($mysqli->connect_errno) {
		printf("Connect failed: %s\n", $mysqli->connect_error);
		exit();
	}

	if (!($stmt = $mysqli->prepare("SELECT Walnut FROM hash WHERE 1"))) {
		echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
	}
	
	if (!$stmt->execute()) {
		echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
	}
	
	if (!($res = $stmt->get_result())) {
		echo "Getting result set failed: (" . $stmt->errno . ") " . $stmt->error;
	}
	
	/* fetch object array */
    If (!($row = $res->fetch_assoc())) {
		echo "fetch of row from DB failed: (" . $stmt->errno . ") " . $stmt->error;
	}

    // The first 64 characters of the hash is the salt
    $salt = substr($row['Walnut'], 0, 64);

    $hash = $salt . $str_json["password"];

    // Hash the password as we did before
    for ( $i = 0; $i < 100000; $i ++ ) {
        $hash = hash('sha256', $hash);
    }

    $hash = $salt . $hash;

    if ( $hash == $row['Walnut'] ) {
	     $_SESSION["isLoggedIn"]=1;
		 if (isset($_POST["walnutID"])) {
            $_SESSION["walnutID"] = $_POST["walnutID"];
		 }
     /*     $_SESSION["user"] = $_POST["user"];	*/	 		 
        //setting a varable so that later i know  
        // that this user i logged in  
        $response = "ok";
    } else {
       // this would destroy the session variables 
        session_destroy();
    }
    echo ($response);
?>