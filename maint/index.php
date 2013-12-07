<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>vasPLUS Programming Blog | Set Website To and From Maintenance Mode using Ajax, Jquery and PHP</title>




<!-- Required header files -->
<link href="css/style.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/jquery_1.5.2.js"></script>
<script type="text/javascript" src="js/vpb_maintenance_mode.js"></script>




</head>
<body>
<center>


<div style=" font-family:Verdana, Geneva, sans-serif; font-size:24px;">Set Website To and From Maintenance Mode using Ajax, Jquery and PHP</div><br clear="all" /><br /><br /><br />
<center>






<div style="font-family:Verdana, Geneva, sans-serif; font-size:11px; color:black; width:800px; line-height:20px;" align="left">To demo the system, please click on the <b>On</b> option of the button below to set this demo website to maintenance mode or click on the <b>Off</b> option of the button to remove the demo website from maintenance mode. <span class="ccc"><a href="website_test_page.php" target="_blank" style="text-decoration:none;"><font style="color:blue; font-size:12px;">Test Page</font></a></span><br /><br /></div><br clear="all"><br clear="all">






<!-- Code Begins Here -->

<?php
//Set the Switch Button appropriately

include "config.php"; //Include the database connection file

//Check website mode so as to set the switch correctly
$check_website_mode = mysql_query("select * from `website_mode` where `id` = '".mysql_real_escape_string('1')."' and `maintenance_mode` = '".mysql_real_escape_string('on')."'");

if(mysql_num_rows($check_website_mode) < 1)
{
	?>
	<input type="hidden" id="vpb_switch_status" value="off" />
	<script type="text/javascript"> $(document).ready(function() { $('div.vpb_switch_button').css('background-position', 'right'); }); </script>
	<?php
}
else
{
	?>
	<input type="hidden" id="vpb_switch_status" value="on" />
	<script type="text/javascript"> $(document).ready(function() { $('div.vpb_switch_button').css('background-position', 'left'); }); </script>
	<?php
}
?>




<!-- The Switch or Radio Buttons -->
<div class="vasplus_programming_blog_wrapper" align="left">
<center>
<br clear="all" />
<div class="vpb_switch_button">
    <label class="off">Off<input type="radio" class="vpb_switch_on_or_off" onclick="vpb_on_off_switch('off');" value="off" /></label>
    <label class="on">On<input type="radio" class="vpb_switch_on_or_off" onclick="vpb_on_off_switch('on');" value="on" /></label>
</div>
<br clear="all" /><div align="center" id="vpb_response"></div><!-- Display Response from the JS File to the user -->
</center>
</div>



<!-- Code Ends Here -->











</center>
</center>
</body>
</html>
