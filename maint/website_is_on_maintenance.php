<?php
include "config.php"; //Include the database connection file

//Check to see if the website has been removed from maintenance mode and allow the user access to the website if YES it has been removed
$check_website_mode = mysql_query("select * from `website_mode` where `id` = '".mysql_real_escape_string('1')."' and `maintenance_mode` = '".mysql_real_escape_string('off')."'");

if(mysql_num_rows($check_website_mode) == 1)
{
	?><script type="text/javascript"> window.location.replace("website_test_page.php"); </script><?php
}
else
{
	//Do not allow the user access yet because the website is still on maintenance mode
}
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>vasPLUS Programming Blog | Set Website To and From Maintenance Mode using Ajax, Jquery and PHP</title>



</head>
<body>
<center>
<div style=" float:right;" align="right">
<INPUT TYPE="button" VALUE="Back" onClick="window.location.href='index.php'" style="padding:10px; margin-right:5px; cursor:pointer;"></div><br clear="all"><br />





<table width="500" border="1" align="center" cellpadding="8" cellspacing="8"><tr><td align="center" colspan="2" style="float:left; width:820px; padding-top:9px;"><p style="font-family: 'Reenie Beanie', serif; font-size: 43px; font-style: normal; font-weight: 400; text-shadow: 4px 4px 4px #bbb;text-decoration: none; text-transform: none;letter-spacing: 0.073em; word-spacing: 0.034em; line-height: 1em;">***Maintenance Mode***</p>
<p style="font-family:Verdana, Geneva, sans-serif; font-size:12px; line-height:23px; padding:10px;" align="left">

Hello There!<br /><br />

We are temporarily unavailable at the moment due to maintenance! We are working hard to give you the very best of service. <br /><br />
Please bear with us and try to check back in a while!<br /><br />
 Thank You!<br />Site Management.<br />


</p></td></tr></table>


</center>
</body>
</html>