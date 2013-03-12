<?php
		require 'db.inc';
		
		$mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
					
	      
		if (!($_POST['value'])) {
			echo 'Error: No data posted to addNut.php';			
			return FALSE;
		}
		$str_json = urldecode($_POST['value']);
	
		$f = json_decode($str_json, true);         // Decode the JSON string and turn it into an array $f
			
		// create a prepared statement 
		if (false === ($stmt = $mysqli->prepare("INSERT INTO nuts VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"))) {
			 echo "Prepare failed - addNut.php line 22: (" . $mysqli->errno . ") " . $mysqli->error;
			return;
		}
//			print_r($f["SirName"]);
//			return;	
		// Bind parameters (an integer and a string). 'is' tells MySQL you're passing an integer(i) and a string(s)
        // Null values are set for the last two fields - field 16 = Created, field 17 = Updated
        $f["Created"] = $f["Updated"] = null;
		$rc = $stmt->bind_param('issssssssssssssss', $f["walnutID"],$f["SirName"],$f["Names"],$f["FormalNames"],$f["Children"],$f["Addr1"],$f["Addr2"],$f["Addr3"],$f["Addr4"],$f["Email1"],$f["Email2"],$f["Email3"],$f["Phone1"],$f["Phone2"],$f["Notes"],$f["Created"],$f["Updated"]); 

		if (false === $rc) 
		{ // bind error
			printf("bind_param error: %s %d\n",$stmt->error,$stmt->errno);
			return;
		}
		
		$rc = $stmt->execute();
		
		if (false === $rc) 
		{
			printf("execute: %s %d\n",$stmt->error,$stmt->errno);
			return;
		}
			
		printf("Added %s" , $f["SirName"]);
		$stmt->close();															 
	
		return;
?>