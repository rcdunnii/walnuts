<?php define('PSD', true); new psd(); class psd { static $version = 'demo';
/*===========================================================================
Debugging script for PHP 5+. Demo. No source code is included.
(C) Andrew Revvo, 2012, http://atrise.com/php/script-debugger/
License: http://atrise.com/we/license/
=============================================================================

Include this file at the top: include_once('psd.php')
or use "psd::init()" or "new psd()"

=============================================================================*/
// Settings

	// Enable PSD. If not enabled, you always can use the url parameter "?psd=password"
	static $enabled = true;

	// Password to use PSD in a disabled state with "?psd=password"
	static $password = 'password';
	
	// Enabled only here
	static $dev_ip_only = '192.168.1.1, 127.0.0.1';
	static $dev_ip_only_enable = false;

	// Log file name, relative path, chmod 0777
	static $log_file='/db/psd.log';

	// Gzip compatible mode
	static $gzip_mode = true;
	
	// Always show source. If not enabled, add ?psd_source=1 to the url
	static $show_source = false;
	
	// A part of CSS style of the PSD div. Use it to move it to another place
	static $css = 'position: absolute; top: 1px; right: 1px; width: 400px;';

/*===========================================================================*/
// Public debug functions:

	// Show a text message in html
	// Example: echo psd::html('<b>I love Atrise PHP Script Debugger</b>');
	static function html($text)
	{
		return '[Demo]';
	}

	// Show a text message
	// Example: echo psd::text('I love Atrise PHP Script Debugger');
	static function text($text)
	{
		return '[Demo]';
	}

	// Show a variable(s)
	// Example: echo psd::v($i, $j, 15);
	static function v()
	{
		return '[Demo]';
	}

	// Show a variable using PHP var_export()
	// Not for OB callbacks!
	// Example: echo psd::var_export($i);
	static function var_export($var)
	{
		return '[Demo]';
	}

	// Show a variable using PHP print_r()
	// Not for OB callbacks!
	// Example: echo psd::print_r($i);
	static function print_r($var)
	{
		return '[Demo]';
	}
	
	// Show a variable using PHP debug_zval_dump()
	// Not for OB callbacks!
	// Example: echo psd::zval_dump($i);
	static function zval_dump(&$var)
	{
		return '[Demo]';
	}

	// Show a backtrace using PHP debug_backtrace()
	// Example: echo psd::backtrace();
	static function backtrace()
	{
		return '[Demo]';
	}

	// Log a string to the log file
	// Example: psd::log('message');
	static function log($text)
	{
		return '[Demo]';
	}
	
/*===========================================================================*/
// Code

	function __construct()
	{
	}

	static function init()
	{
	}

} ?>