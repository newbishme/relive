<?php

require_once '/var/www/vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;
use \relive\Crawlers\GPlusCrawler;

$twitter = TwitterCrawler::getInstance();
$instagram = InstagramCrawler::getInstance();
$gplus = GPlusCrawler::getInstance();

$jobs = \relive\models\CrawlJob::where('isActive', '=', 1)->get();

foreach ($jobs as $job) {
	$event = \relive\models\Event::find($job->event_id);
	$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $job->event_id)->get();
	foreach ($hashtagRelationships as $hashtagRelationship) {
		$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
		$twitter->recentCrawl($event, $hashtag->hashtag);
		$instagram->recentCrawl($event, $hashtag->hashtag);
		$gplus->recentCrawl($event, $hashtag->hashtag);
	}
}