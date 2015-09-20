<?php

require_once '/var/www/vendor/autoload.php';

use \relive\models\Event;

//Every 24 hours
foreach (Event::all() as $event) {
	$event->rankPoints = $event->rankPoints/2;
	$event->save();
}