<?php
/********************************************************************************************************************
* Set Website To and From Maintenance Mode using Ajax, Jquery and PHP
* This script is brought to you by Vasplus Programming Blog by whom all copyrights are reserved.
* Website: www.vasplus.info
* Email: vasplusblog@gmail.com or info@vasplus.info
*********************************************************************************************************************/


//INCLUDE THIS PAGE AT THE TOP SIDE OF ALL YOUR WEBSITE PAGES THAT YOU WANT TO CHECK FOR MAINTENANCE 
include "dbFoxy.inc"; //Include the database connection file

// Your Current IP Address being the admin of the website provided it has not changed from the saved IP Address

$current_admin_ip_address = trim(strip_tags($_SERVER['REMOTE_ADDR']));

$mysqli = new mysqli($server, $user, $password, $database);

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

if (!($stmt = $mysqli->prepare("select * from `website_mode` where `id` = '".mysql_real_escape_string("1")."'"))) {
    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
}

if (!$stmt->execute()) {
     echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}

if (!($result = $stmt->get_result())) {
    echo "Getting result set failed: (" . $stmt->errno . ") " . $stmt->error;
}

$row = $result->fetch_array(MYSQLI_ASSOC);

$maintenance_mode = trim(strip_tags($row["maintenance_mode"])); //Maintenance Status

$allow_admin_ip_address = trim(strip_tags($row["admin_ip_address"])); //Saved Admin IP Address

if($maintenance_mode == strip_tags("on"))
{
	if($allow_admin_ip_address == $current_admin_ip_address)
	{ 
        echo "okForAdmin"; 
		//Allow the admin of this website alone to continue on the website with his or her maintenance process and this is cool guys
	}
	else //Otherwise
	{
		//Take every other user or visitor that accessed the website to the maintenance page to tell them that the website is currently under maintenance
		echo "notOk";
	}
} else { // maint mode is off
    echo "okForAll"; // ok to proceed to site
}
    
return;

?>