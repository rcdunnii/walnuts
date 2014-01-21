  <?php
	   
        // check tableName param was set in the query string
       
	    $tableName = $_GET['value'];
	   
        require_once('dbFoxy.inc');  // database info
    
        $mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}

        /* see if tableName already exists, if not create, if so notify user */
        $tableName = strtolower($tableName);
        
        $res = $mysqli->query("DROP TABLE IF EXISTS $tableName");
		if ($res === false) {
			printf("DROP TABLE error: %s", $mysqli->error);
			$mysqli->close();
			return;
		}
		
		$res = $mysqli->query("DELETE  FROM tabletags WHERE tableName=\"$tableName\"");
		if ($res === false) {
			printf("DELETE row FROM tabletags table,  error: %s", $mysqli->error);
			$mysqli->close();
			return;
		}
		
		$mysqli->close();
		
		printf("$tableName table dropped from $database database<br>");
		printf("$tableName row dropped from tabletag table");
		
		return;
?>