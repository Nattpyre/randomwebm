<?php

define ('DS', DIRECTORY_SEPARATOR);
$sitePath = realpath(dirname(__FILE__) . DS) . DS;
define ('SITE_PATH', $sitePath); 

define('DB_USER', 'rovnatt');
define('DB_PASS', 'qaz312wsx');
define('DB_HOST', 'localhost');
define('DB_NAME', 'random_webm');

define('VERSION', '1.1.3');