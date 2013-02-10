<?php
	require 'db.inc';
		
	$mysqli = @ new mysqli($server, $user, $password, $database);
		
	/* check connection */
	if ($mysqli->connect_errno) {
		printf("Connect failed: %s\n", $mysqli->connect_error);
		exit();
	}
	
	$nutID = $_GET['value'];			

	if (!($stmt = $mysqli->prepare("SELECT * FROM nuts WHERE walnutID = {$nutID}"))) {
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

/*
	$sql ="SELECT * FROM nuts WHERE walnutID = {$nutID}";
		
	$result = $mysqli->query($sql);	
		
	if ($mysqli->error) {
		try {    
			throw new Exception("MySQL error $mysqli->error <br> Query:<br> $sql", $mysqli->errno);    
		} catch(Exception $e ) {
			echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
			echo nl2br($e->getTraceAsString());
			}
		$mysqli->close();
		return;
	}

	$row = $result->fetch_array(MYSQLI_ASSOC);
	
	$result->free();
	
	$mysqli->close();		
*/

	echo json_encode($row);
	
			
	
?> 
			