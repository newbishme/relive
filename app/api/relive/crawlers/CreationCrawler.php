<?php
namespace relive\Crawlers;

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

class CreationCrawler extends \relive\Crawlers\Crawler {

	public static function initialCrawl ($event) {
		$twitterCrawler = TwitterCrawler::getInstance();
		//$instagramCrawler = InstagramCrawler::getInstance();
		$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $event->event_id)->get();
		foreach ($hashtagRelationships as $hashtagRelationship) {
			$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
			$twitterCrawler->popularCrawl($event, $hashtag->hashtag);
		}
		\relive\models\CrawlJob::create([
				'event_id'=>$event->event_id
		]);
	}

}