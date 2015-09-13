<?php

require_once '../../../../vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

$twitter = TwitterCrawler::getInstance();
$instagram = InstagramCrawler::getInstance();

// Crawl using a cronjob