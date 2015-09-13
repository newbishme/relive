<?php

require_once '/var/www/vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

$twitter = TwitterCrawler::getInstance();
$instagram = InstagramCrawler::getInstance();

$jobs = \relive\models\CrawlJob::where('isActive', '=', 1)->get();
$startTime = time();

foreach ($jobs as $job) {
	$event = \relive\models\Event::find($job->event_id);
	$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $job->event_id)->get();
	foreach ($hashtagRelationships as $hashtagRelationship) {
		$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
		$twitter->recentCrawl($startTime, $event, $hashtag->hashtag);
	}
}