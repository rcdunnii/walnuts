<?php
		require 'db.inc';
		// see which user (admin or not) has called this fxn
		
		$who = ($_GET['value']);
		
		// make connection to mysql server
		$mysqli = new mysqli($server,$user,$password,$database);
		if ($mysqli->connect_errno) {
			echo 'Error: File' . __FILE__ . 'line#' .__LINE__ . $mysqli->connect_error;
			$mysqli->close();
			return false;
		}
	
		$stmt = $mysqli->prepare("SELECT * FROM nuts ORDER by SirName");
	
		if ($stmt == false) 
		{ // bind error
			printf("bind_param error: %s %d\n",$stmt->error,$stmt->errno);
			return;
		}

		$stmt->execute();
		
		if($stmt == false)
		{
			printf("execute: %s %d\n",$stmt->error,$stmt->errno);
			return;
		} else {						
			if (!($res = $stmt->get_result())) {
				echo "Getting result set failed: (" . $stmt->errno . ") " . $stmt->error;
			}
			/* declare array variable to contain all the database records */
			$results = array();
			/* get the database data into $results array to allow us to format/present it... */
			while ($row = $res->fetch_assoc()) {
				$results[] = $row;
			}
			$stmt->close();
			$mysqli->close();
			echo json_encode($results);
		}

?>