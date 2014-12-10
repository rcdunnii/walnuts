<?php

   function maintMode() {
		require_once('dbFoxy.inc'); 
		
		// find out from database if maintenance mode is on or off

		$mysqli = new mysqli($server, $user, $password, $database);

		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
        
/*		if (!($stmt = $mysqli->prepare("select * from `website_mode` where `id` = '".mysql_real_escape_string("1")."'"))) {     */
        if (!($stmt = $mysqli->prepare("select * from `website_mode` where `id` = 1"))) {        
			echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
            return;
		}
		
		if (!$stmt->execute()) {
			 echo "Execute failed: (" . $stmt->errno . "), line ". __LINE__ .", file ". __FILE__ .", " . $stmt->error;
             return;
		}

		if (!($result = $stmt->get_result())) {
			echo "Getting result set failed: (" . $stmt->errno . ") " . $stmt->error;
            return;
		}

		if (!($row = $result->fetch_assoc())) { /*If nothing has previously been inserted into the website maintentance table */
		
			$id = 1; // admin user id
			$admin_ip_address = trim(strip_tags($_SERVER['REMOTE_ADDR']));
			$maintenance_mode = "on";
			$date =  date('d-m-Y');
           
			// create a prepared statement 
			if (!$stmt = $mysqli->prepare("INSERT INTO website_mode(id, maintenance_mode, admin_ip_address, date) VALUES (?,?,?,?)")) {
				 echo "Prepare failed - walnutAction.php line 31: (" . $mysqli->errno . ") " . $mysqli->error;
				return;
			}

			if (!$stmt->bind_param('isss', $id, $maintenance_mode, $admin_ip_address, $date ) ) {
				// bind error
				printf("bind_param error: %s %d\n",$stmt->error,$stmt->errno);
				return;
			}
			
            
			if (!$stmt->execute()) {
			    echo "Execute failed: (" . $stmt->errno . "), line ". __LINE__ .", file ". __FILE__ .", " . $stmt->error;
                return;
			}		
			
		} else {
		
			if ($row['maintenance_mode'] == 'off') {
						
				$id = 1; // admin user id
				$admin_ip_address = trim(strip_tags($_SERVER['REMOTE_ADDR']));
				$maintenance_mode = "on";
				$date =  date('d-m-Y');
								
				// create a prepared statement to set maintenance mode to 'on'
				
				if (!$stmt = $mysqli->prepare("UPDATE website_mode SET id = ?, maintenance_mode = ?, admin_ip_address = ?, date = ?")) {
					 echo "Prepare failed - walnutAction.php line 31: (" . $mysqli->errno . ") " . $mysqli->error;
					return;
				}

				if (!$stmt->bind_param('isss', $id, $maintenance_mode, $admin_ip_address,  $date) ) {
					// bind error
					printf("bind_param error: %s %d\n",$stmt->error,$stmt->errno);
					return;
				}
				
				if (!$stmt->execute()) {
			        echo "Execute failed: (" . $stmt->errno . "), line ". __LINE__ .", file ". __FILE__ .", " . $stmt->error;
                    return;
				}
			
			} else if($row['maintenance_mode'] == 'on') {
			
				$id = 1; // admin user id
				$admin_ip_address = trim(strip_tags($_SERVER['REMOTE_ADDR']));
				$maintenance_mode = "off";
				$date =  date('d-m-Y');
				
				// create a prepared statement to set maintenance mode to 'on'
				
				if (!$stmt = $mysqli->prepare("UPDATE website_mode SET id = ?, maintenance_mode = ?, admin_ip_address = ?, date = ?")) {
					 echo "Prepare failed - walnutAction.php line 31: (" . $mysqli->errno . ") " . $mysqli->error;
					return;
				}

				if (!$stmt->bind_param('isss', $id, $maintenance_mode, $admin_ip_address,  $date) ) {
					// bind error
					printf("bind_param error: %s %d\n",$stmt->error,$stmt->errno);
					return;
				}
				
				if (!$stmt->execute()) {
			        echo "Execute failed: (" . $stmt->errno . "), line ". __LINE__ .", file ". __FILE__ .", " . $stmt->error;
                    return;
				}
			}

		}
		echo ("Maintenance mode set to " . $maintenance_mode);
		$mysqli->close();
		return;
	}
	
   function createNutsDBs() {
        require_once('dbFoxy.inc');  // database info
        /* create database   */
		
		$mysqli = new mysqli($server, $user, $password);

		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
		
		/* sql query with CREATE DATABASE */
		$sql = "CREATE DATABASE $database DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci";

		// Performs the $sql query on the server to create the database
		$res = $mysqli->query($sql) ;

		if ($mysqli->error) {
			try {
    		    throw new Exception("MySQL error $mysqli->error ", $mysqli->errno);
			} catch(Exception $e ) { 
                echo "Error No: ".$e->getCode(). " - ". $e->getMessage();                        
			}
			$mysqli->close();
			return false;
		}
        
        $mysqli = new mysqli($server, $user, $password, $database);
		if ($mysqli->connect_errno) {
			die( 'Error: File:' . __FILE__ . 'line#' . __LINE__ . $mysqli->errno); 
		}
					
		$sql = "CREATE TABLE bdays 
			(
			bDayID int NOT NULL AUTO_INCREMENT,
            PRIMARY KEY (bDayID),
			FirstName varchar(30) NOT NULL,
            MiddleInit char(2) NULL,            
			LastName varchar(50) NOT NULL,					
			bDayYYYY char(4) NULL,
            bDayMM char(3) NOT NULL,
            bDayDD char(2) NOT NULL,
            WalnutID int,
            INDEX name (LastName, MiddleInit, FirstName),
            INDEX bdMonth (bDayMM),
            INDEX bDayDD (bDayDD)
			)";
			
		// Performs the $sql query on the server to create the table
		$res = $mysqli->query($sql);
		
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
					
		$sql = "CREATE TABLE nuts 
			(
			walnutID int NOT NULL AUTO_INCREMENT, 	/* numeric key for this record */
			PRIMARY KEY(walnutID),                	/* make it primary key */
            visibility tinyint(1) NOT NULL DEFAULT 1, /* set visibility of each member with this val, 1==vis, 0==invis  */            
			SirName varchar(20),					/* Generic Sirname - e.g. Dunn */	
			Names varchar(50),						/* Names - e.g. Bob and Sarah Skinner Dunn	*/
			FormalNames varchar(50),				/* Letter Address - e.g. Dr. and Mrs Robert C Dunn Jr */
			Children varchar(50),					/* Children's Names, ages etc */
			Addr1 varchar(35),						/* Street */
			Addr2 varchar(35),						/* Apt, business */
			Addr3 varchar(35),						/* Country, State, Zip */
			Addr4 varchar(35),						/* Misc */			
			Email1 varchar(30),						/* Email addresses */
			Email2 varchar(30),
			Email3 varchar(30),
			Phone1 varchar(30),						/* Phone 1 */
			Phone2 varchar(30),						/* Phone 2 */
			Notes varchar(50),						/* Notes */			
            Created DATETIME NOT NULL DEFAULT '1900-01-01 00:00:00',                          /* column to set date created   */
            Updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  /* column set to date updated   */
			)";
			
		// Performs the $sql query on the server to create the table
		$res = $mysqli->query($sql);
		
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
        
		// Set a trigger to set a time value for 'Created' field of nuts table whenever a new nut is added to the db
        $sql = "CREATE TRIGGER NUT_CREATED BEFORE INSERT ON nuts FOR EACH ROW SET NEW.Created = NOW()";
     		
		$res = $mysqli->query($sql);
        
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
        
        $sql = "CREATE TABLE hash
        (
            Walnut text NOT NULL,
            Foxy text NOT NULL
        )";

        $res = $mysqli->query($sql);
        
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
        
		echo "$database successfully created!";		
		$mysqli->close();
		return;		
	}
	
	function deleteNutsDBs() {
        require_once('dbFoxy.inc');  // database info
        
		$mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
		
		$res = $mysqli->query("DROP DATABASE IF EXISTS $database");
		
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
        
        $mysqli->close();
      
		echo "Ouch... Databases deleted";

		return;					
	}
	
    function backUpDB() {
        require_once('dbFoxy.inc');  // database info
        
        $dir = "db_backup";  
        //if the db directory doesn't exist yet, create it
        if (!is_dir($dir))
            mkdir($dir);  
        //create the file name for the backup 
        $BU = $dir.'/nutDB_'.date("m-d-Y_H-i-s").'.sql';
        $result = 0;
        $log = $dir.'/dblog';  
        //make the system call to mysqldump
		
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            if (file_exists("C:/xampp/")) {
                $mysqldump = "C:/xampp/mysql/bin/mysqldump.exe";
            } else if (file_exists("D:/xampp/")) {
                $mysqldump = "D:/xampp/mysql/bin/mysqldump.exe";
            }             
		} else {
			$mysqldump = "/usr/bin/mysqldump";
		}
		
        exec("$mysqldump --debug='d:f:i:o,/tmp/mysql_debug.log' --user=$user --password=$password --host=$server  $database  > $BU", $output, $result);
		
        if ($result == 0) {           
           echo ("<p>Backup OK!<br /><a class=\"downLoad\" href=\"$BU\" download>Click to Download</a>&nbsp;&nbsp;&nbsp;<a class= \"downLoad\" href=\"#\" >Skip Download</a></p>");
        } else {
            echo ("Backup failed with error # " . $result . " see /tmp/mysql_debug.log");
        }
}

// not used in single table (i.e. single contact group) mode - eventually may code program to handle multiple separate contact groups
     function addTable($tableName) {

        // check tableName param was set in the query string
       if(empty($_GET['tableName']))
       {
         // query string had param set to nothing ie ?param=&param2=something
         echo "Must specify group name!";
         return;
       }
        require_once('dbFoxy.inc');  // database info
    
        $mysqli = @ new mysqli($server, $user, $password, $database);
		
		// check connection
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}

       // see if tableName already exists, if not create, if so notify user
        $tableName = preg_replace("/[^A-Za-z0-9 ]/", '', (strtolower($tableName)));
        
        $res = $mysqli->query("select 1 from $tableName");

        if($res !== FALSE)
        {
           //notify $tableName EXISTS!
           echo "$tableName already exists!";
           return;
        }
        else
        {
            //create new table $tableName
            $sql = "CREATE TABLE $tableName 
                (
                walnutID int NOT NULL AUTO_INCREMENT, 	// numeric key for this record
                PRIMARY KEY(walnutID),                	// make it primary key
                visibility tinyint(1) NOT NULL DEFAULT 1, /* set visibility of each member with this val, 1==vis, 0==invis
                SirName varchar(20),					// Generic Sirname - e.g. Dunn	
                Names varchar(50),						// Names - e.g. Bob and Sarah Skinner Dunn
                FormalNames varchar(50),				// Letter Address - e.g. Dr. and Mrs Robert C Dunn Jr
                Children varchar(50),					// Children's Names, ages etc
                Addr1 varchar(35),						// Street
                Addr2 varchar(35),						// Apt, business
                Addr3 varchar(35),						// Country, State, Zip
                Addr4 varchar(35),						// Misc 			
                Email1 varchar(30),						// Email addresses 
                Email2 varchar(30),
                Email3 varchar(30),
                Phone1 varchar(30),						// Phone 1 
                Phone2 varchar(30),						// Phone 2 
                Notes varchar(50),						// Notes		
                Created DATETIME NOT NULL DEFAULT '1900-01-01 00:00:00',                         // column to set date created   
                Updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP // column set to date updated   
                )"; 
                
        }
		// Performs the $sql query on the server to create the table
		$res = $mysqli->query($sql);
		
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
        
		// Set a trigger to set a time value for 'Created' field of nuts table whenever a new nut is added to the db
        $sql = "CREATE TRIGGER $tableName BEFORE INSERT ON $tableName FOR EACH ROW SET NEW.Created = NOW()";
     		
		$res = $mysqli->query($sql);
        
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
        
        echo ($tableName . " group successfully created!");
		
		// add new table name to tabletags table with access set to public
		$id = null; // admin user id - auto incremented by mysql
		$newTableName = $tableName;
		$access = "public";
		$notes = "family table";
           
		// create a prepared statement 
		if (!$stmt = $mysqli->prepare("INSERT INTO tabletags(id, tableName, access, notes) VALUES (?,?,?,?)")) {
			echo "Prepare failed - walnutAction.php line 31: (" . $mysqli->errno . ") " . $mysqli->error;
			return;
		}

		if (!$stmt->bind_param('isss', $id, $newTableName, $access, $notes ) ) {
			// bind error
			printf("bind_param error: %s %d\n",$stmt->error,$stmt->errno);
			return;
		}
		
		if (!$stmt->execute()) {
				echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
                return;
		}	

		echo  ("\n" . $tableName . " added to tabletags table, access set to public.");
		
        $mysqli->close();
		
        return;		
    }

 // not used in single table (i.e. single contact group) mode - eventually may code program to handle multiple separate contact groups in which case can use this function to list these groups   
    function getTableTagsArray() {
    
      require('dbFoxy.inc');  // database info
    
        $mysqli = new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
        
        /* get all tables and their accessibility from tabletags table 
           structure of tabletags is
           id           int
           tableName    text
           access       text ('admin' or 'public')
           notes        text
        */
        
        $query = "SELECT * from tabletags";
        
        $result = $mysqli->query($query);

        // assoc array of tableName=>access
        $tableTagsRows = array();
        
        while ($row = $result->fetch_assoc()) {
            $tableTagsRows[$row["tableName"]] =  $row["access"];    /* want to create assoc array of tablename => access value */
        }
       
        $result->close();
        
        $mysqli->close();
        
        return $tableTagsRows;
    }
            
  // not used in single table (i.e. single contact group) mode - eventually may code program to handle multiple separate contact groups in which case can use this function to list these groups     
    function listTables() { // if $returnArr, return array of tables, else simply print tables list
    
        require_once('dbFoxy.inc');  // database info
    
        $mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
        // get assoc array of tables with key of table name, value of admin or public visibility
        $tableAccessArray = getTableTagsArray();
     
        $res = $mysqli->query("SHOW TABLES");

        $nr = $res->num_rows;
        
        if ($nr > 0) {        
			printf ("<p>There are %d tables in %s database<br>Here are public ones...</p>", $nr, $database); 
			printf('<ul style="text-align: left">');
			 /* fetch enumerated array - fetch_row */
			 for ($i = 0; $i < $nr; $i++) {
				$row = $res->fetch_row();
				if ($tableAccessArray[$row[0]] == "public") {
				// $row[0] from SHOW TABLES query has table name which is the index to the access value in $tableAccessArray
					printf ("<li>%s - %s table</li>", $row[0], $tableAccessArray[$row[0]]); 
				}
			}
			printf("</ul>");                             
        } else {
            printf ("<p>There are 0 tables in %s database!</p>", $database); 
        }    
        
        /* free result set */
        $res->close();    

        /* close connection */
        $mysqli->close();        

        return;
    } 

 // not used in single table (i.e. single contact group) mode - eventually may code program to handle multiple separate contact groups in which case can use this function to select a specific table(group)
    function selectTable() {
		require_once('dbFoxy.inc');  // database info
    
        $mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
        // get assoc array of tables with key of table name, value of visibility (admin or public)
        $tableAccessArray = getTableTagsArray();
     
        $res = $mysqli->query("SHOW TABLES");

        $nr = $res->num_rows;
        
        if ($nr > 0) {            
			$pubTablesArr = array();
			 for ($i = 0, $j = 0; $i < $nr; $i++) {
				$row = $res->fetch_row();
				// put public contact tables into an integer indexed array
				if ($tableAccessArray[$row[0]] == "public") {
					$pubTablesArr[$j++] = $row[0];
				// $row[0] from SHOW TABLES query has table name which is the index to the access value in $tableAccessArray
				}
			}	
			printf ("<p>There are %d tables in %s database<br>Here are public ones...</p>", $nr, $database); 
			printf('<ul style="text-align: left">');
			foreach ($pubTablesArr as $table) {
				printf("<li><a href='#' onclick='deleteTable(\"%s\")' title='Delete'>%s</a></li>", $table, $table);
			}
			printf("</ul>");         
        } else {
            printf ("<p>There are 0 tables in %s database!</p>", $database); 
        }    
        
        /* free result set */
        $res->close();    

        /* close connection */
        $mysqli->close();
        
        return;
    } 
    
    
	if (($_REQUEST['value']) != "") {
	   $whichDashBoardOpt = $_REQUEST['value'];
	   if ($whichDashBoardOpt == "createNutsDBs") {
           createNutsDBs();
       } elseif ($whichDashBoardOpt == "deleteNutsDBs") {				
		   deleteNutsDBs();
	   } elseif ($whichDashBoardOpt == "listTables") {		// not currently used		
		   listTables();
 	   } elseif ($whichDashBoardOpt == "addTable") {		// not currently used				
		   addTable($_REQUEST['tableName']);
       } elseif ($whichDashBoardOpt == "delTable") {		// not currently used
           selectTable(); // select table to delete
	   } elseif ($whichDashBoardOpt == "maintMode") {      
          maintMode();
       } elseif ($whichDashBoardOpt == "bkUpDB") {      
          backUpDB();           
       } else {
		   printf("No option %s line %i file %s", $whichDashBoardOpt, __LINE__, __FILE__);			   
	   }  
	} else {
		echo "please enter choice before submitting the form!";
		return;
	}
	
?>
