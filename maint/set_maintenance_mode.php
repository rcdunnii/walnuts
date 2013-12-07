<?php
/********************************************************************************************************************
* Set Website To and From Maintenance Mode using Ajax, Jquery and PHP
* This script is brought to you by Vasplus Programming Blog by whom all copyrights are reserved.
* Website: www.vasplus.info
* Email: vasplusblog@gmail.com or info@vasplus.info
*********************************************************************************************************************/


include "config.php"; //Include the database connection file

if(isset($_POST["page"]) && !empty($_POST["page"])) //Page validation
{
	if($_POST["page"] == "set_maintenance") //Website Maintenance Setting Page
	{
		$vpb_website_mode = trim(strip_tags($_POST['mode']));
		
		// Allow only the admin to access the website while it is on maintenance mode. 
		//Comment the below line of code if you do not wish to allow yourself being the admin to see the system when you have set it to maintenance
		//$vpb_admin_ip_address = trim(strip_tags($_SERVER['REMOTE_ADDR'])); 
		
		//Check previous insertion
		$check_prev = mysql_query("select * from `website_mode` where `id` = '".mysql_real_escape_string('1')."'");
		
		if(mysql_num_rows($check_prev) < 1) //If nothing has previously been inserted into the website maintentance table
		{
			//Insert the maintenance status
			mysql_query("insert into `website_mode` values('".mysql_real_escape_string('1')."', '".mysql_real_escape_string($vpb_website_mode)."', '".mysql_real_escape_string($vpb_admin_ip_address)."', '".mysql_real_escape_string(date('d-m-Y'))."')");
		}
		else
		{
			//Update the table with the current website maintenance status
			mysql_query("update `website_mode` set `maintenance_mode` = '".mysql_real_escape_string($vpb_website_mode)."', `admin_ip_address` = '".mysql_real_escape_string($vpb_admin_ip_address)."' where `id` = '".mysql_real_escape_string('1')."'");
		}
	}
	else
	{
		//Unknown page seen
	}
}
?>