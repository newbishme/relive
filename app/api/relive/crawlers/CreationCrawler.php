<?php
require_once '/var/www/vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;
use \relive\Crawlers\GPlusCrawler;

$event_id = $argv[1];
$event = \relive\models\Event::find($event_id);

$twitterCrawler = TwitterCrawler::getInstance();
$instagramCrawler = InstagramCrawler::getInstance();
$gPlusCrawler = GPlusCrawler::getInstance();
$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $event->event_id)->get();
foreach ($hashtagRelationships as $hashtagRelationship) {
	$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
	$twitterCrawler->popularCrawl($event, $hashtag->hashtag);
	$instagramCrawler->initialCrawl($event, $hashtag->hashtag);
	$gPlusCrawler->initialCrawl($event, $hashtag->hashtag);
}