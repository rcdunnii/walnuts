<?php
/********************************************************************************************************************
* Set Website To and From Maintenance Mode using Ajax, Jquery and PHP
* This script is brought to you by Vasplus Programming Blog by whom all copyrights are reserved.
* Website: www.vasplus.info
* Email: vasplusblog@gmail.com or info@vasplus.info
*********************************************************************************************************************/


/* Database Connection Settings */

define ('hostnameorservername','localhost'); // Your host or server name goes in here
define ('serverusername','walnuts'); // Your Server Username goes in here
define ('serverpassword','Noyer#2013'); // Your Server Password goes in here
define ('databasenamed','walnuts'); // Your Database name goes in here

global $connection;
$connection = @mysql_connect(hostnameorservername,serverusername,serverpassword) or die('Connection could not be made to the SQL Server.');
@mysql_select_db(databasenamed,$connection) or die('Connection could not be made to the database.');		
?>
