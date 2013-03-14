<?php> /* see if user can edit nut by requiring logon */
        require 'db.inc';
		
		$mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
        
        session_start();
        
        if (authenticateUser(