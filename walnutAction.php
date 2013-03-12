<?php
	
   function createDB() {   		

		require 'db.inc';  // database info	
		
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
				throw new Exception("MySQL error $mysqli->error <br> Query:<br> $sql", $mysqli->errno);    
			} catch(Exception $e ) {
				echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
				echo nl2br($e->getTraceAsString());
				}
			$mysqli->close();
			return;
		}	
		$mysqli = new mysqli($server, $user, $password, $database );
		if ($mysqli->connect_errno) {
			die( 'Error: File:' . __FILE__ . 'line#' . __LINE__ . $mysqli->errno); 
		}
					
		$sql = "CREATE TABLE nuts 
			(
			walnutID int NOT NULL AUTO_INCREMENT, 	/* numeric key for this record */
			PRIMARY KEY(walnutID),                	/* make it primary key */
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
        
		echo "$database Database successfully created!";		
		$mysqli->close();
		return;		
	}
	
	function deleteDB() {
		require 'db.inc';  // database info	
		
		$mysqli = @ new mysqli($server, $user, $password, $database);
		
		/* check connection */
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
		
		$res = $mysqli->query('DROP DATABASE walnuts1');
		
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
		
		echo "Ouch...$database Database deleted";
		$mysqli->close();
		return;					
	}
	
	
	if (($_REQUEST['value']) != "") {
	   $whichWalnut = $_REQUEST['value'];
	   if ($whichWalnut == "createDB") {
		  createDB();
	   } elseif ($whichWalnut == "deleteDB") {				
		 deleteDB();
	   } else {
		 echo "Uh oh...";			   
	   }  
	} else {
		echo "please enter choice before submitting the form!";
		return;
	}
	
?>
