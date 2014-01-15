<?php
	require 'db.inc';
		
	$mysqli = @ new mysqli($server, $user, $password, $database);
		
	/* check connection */
	if ($mysqli->connect_errno) {
		printf("Connect failed: %s\n", $mysqli->connect_error);
		exit();
	}
	
	$nutID = $_GET['value'];
	
	/* get current visibility status for this nut - can be 0 or 1 - a boolean */
	$currentVisibility = $mysqli->query("SELECT visibility FROM nuts WHERE walnutID = {$nutID}")->fetch_object()->visibility;
	
	/* toggle current visibility status */
	if ($currentVisibility == 0) {
		$mysqli->query("UPDATE nuts SET visibility=1 WHERE walnutID = {$nutID}");
		echo "nowVisible";
	} else {
		$mysqli->query("UPDATE nuts SET visibility=0 WHERE walnutID = {$nutID}");
		echo "nowInvisible";		
	}
    
	$mysqli->close();
	
    exit;			
	
?> 
			