<?php

require_once '../../../../vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

$twitter = TwitterCrawler::getInstance();
$instagram = InstagramCrawler::getInstance();

$jobs = \relive\models\CrawlJob::where('isActive', '=', 1)->get();
$startTime = time();

foreach ($jobs as $job) {
	$event = \relive\models\Event::find($job->event_id);
	foreach ($event->getHashtagsAttribute as $hashtag) {
		$twitter->recentCrawl($startTime, $hashtag);
	}
}