<?php

function IsNullOrEmptyString($informalnames){
    return (!isset($informalnames) || trim($informalnames)==='');
}



?>