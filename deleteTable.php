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
		
		$mysqli->close();
		
		printf("$tableName dropped from $database database");
		
		return;
?>