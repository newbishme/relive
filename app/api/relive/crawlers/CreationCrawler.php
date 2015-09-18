<?php
require_once '/var/www/vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

$event = $argv[1];

echo "A";

$event = \relive\models\Event::find($event);

$twitterCrawler = TwitterCrawler::getInstance();
$instagramCrawler = InstagramCrawler::getInstance();
$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $event->event_id)->get();
foreach ($hashtagRelationships as $hashtagRelationship) {
	$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
	$twitterCrawler->popularCrawl($event, $hashtag->hashtag);
	$instagramCrawler->initialCrawl($event, $hashtag->hashtag);
}
\relive\models\CrawlJob::create([
		'event_id'=>$event->event_id
]);