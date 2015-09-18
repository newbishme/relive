<?php

use Illuminate\Database\Capsule\Manager as Capsule;
/**
 * Configure the database and boot Eloquent
 */
$capsule = new Capsule;
$capsule->addConnection(array(
    'driver'    => 'mysql',
    'host'      => 'localhost',
    'database'  => 'relive',
    'username'  => 'root',
    'password'  => getenv('MYSQL_PASSWORD'),
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4',
    'prefix'    => ''
));
$capsule->setAsGlobal();
$capsule->bootEloquent();
// set timezone for timestamps etc
date_default_timezone_set('Asia/Singapore');