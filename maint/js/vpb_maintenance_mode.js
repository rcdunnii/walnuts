/********************************************************************************************************************
* Set Website To and From Maintenance Mode using Ajax, Jquery and PHP
* This script is brought to you by Vasplus Programming Blog by whom all copyrights are reserved.
* Website: www.vasplus.info
* Email: vasplusblog@gmail.com or info@vasplus.info
*********************************************************************************************************************/

//Auto display the switch button on page load
$(document).ready(function()
{
	$('.vpb_switch_button').css('background', 'url("images/switch.png")');
	$('.vpb_switch_on_or_off').css('display','none');
	$('.on, .off').css('text-indent','-50000px'); 
});

//Set Website To and From Maintenance Mode Function
function vpb_on_off_switch(vpb_status)
{
	var vpb_switch_status = $("#vpb_switch_status").val();
	if(vpb_switch_status == vpb_status) 
	{
		//Do nothing when the switch has already been turned
		return false;
	}
	else
	{
		var dataString = 'mode=' + vpb_status + '&page=set_maintenance';
		$.ajax({  
			type: "POST",  
			url: "set_maintenance_mode.php",  
			data: dataString,
			beforeSend: function() 
			{
				//Show loading image
				$("#vpb_response").html('<div align="center" style=" padding-top:6px;"><font style="font-family:Verdana, Geneva, sans-serif; font-size:12px; color:black;">Please wait</font> <img src="images/loading.gif" alt="Loading...." align="absmiddle" title="Loading...."/></div><br clear="all" />');
				
			},  
			success: function(response)
			{
				if(vpb_status == 'on')
				{
					$('div.vpb_switch_button').css('background-position', 'left'); 
					$("#vpb_switch_status").val(vpb_status);
					$('#vpb_response').hide().fadeIn(1000).html('<div class="vpb_response_class">The website maintenance mode has been turned: <b>'+vpb_status+'</b></div>');
				}
				else if(vpb_status == 'off')
				{
					$('div.vpb_switch_button').css('background-position', 'right'); 
					$("#vpb_switch_status").val(vpb_status);
					$('#vpb_response').hide().fadeIn(1000).html('<div class="vpb_response_class">The website maintenance mode has been turned: <b>'+vpb_status+'</b></div>');
				}
				else
				{
					//Do nothing since the status brought is unknown
				}
			}
		});
	}
}