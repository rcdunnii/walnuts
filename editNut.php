<?php
        /* called by ajaxEditNut() js function in ajaxWalnutCoreJSON.js */
		require 'db.inc';
        
		include_once($_SERVER["DOCUMENT_ROOT"] . "/functions.php");	
        
		$mysqli=  @ new mysqli($server,$user,$password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
		
		if (!($_POST['value'])) {
			echo 'Error: No data posted to editNut.php';			
			return FALSE;
		}
		$str_json = $_POST['value'];		
		
		$f = json_decode($str_json, true);         // Decode the JSON string and turn it into an array $f
		
		// create a prepared statement 
		if ( !($stmt = $mysqli->prepare("UPDATE nuts SET SirName=?, Names=?, FormalNames=?, Children=?, Addr1=?, Addr2=?, Addr3=?,Addr4=?, Email1=?, Email2=?, Email3=?, Phone1=?, Phone2=?, Notes=? WHERE walnutID=?"))) {
			 echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
			return;
		}

		// Bind parameters (an integer and a string). 'is' tells MySQL you're passing an integer(i) and a string(s)
		$stmt->bind_param('ssssssssssssssi', $f["SirName"],$f["Names"],$f["FormalNames"],$f["Children"],$f["Addr1"],$f["Addr2"],$f["Addr3"],$f["Addr4"],$f["Email1"],$f["Email2"],$f["Email3"],$f["Phone1"],$f["Phone2"], $f["Notes"], $f["walnutID"]); 

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
		}
								
		$stmt->close();															 
        
		$notification = (IsNullOrEmptyString($f["Names"])) ? $f["SirName"] : $f["Names"];
        
		printf("Edited %s" , $notification);
			
		return;									

?>