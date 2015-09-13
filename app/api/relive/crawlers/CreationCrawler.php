<?php
namespace relive\Crawlers;

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

class CreationCrawler extends \relive\Crawlers\Crawler {

	public static function initialCrawl ($event) {
		$twitterCrawler = TwitterCrawler::getInstance();
		//$instagramCrawler = InstagramCrawler::getInstance();
		foreach ($event->getHashtagsAttribute() as $hashtag) {
			$twitterCrawler->popularCrawl($event, $hashtag);
		}
		\relive\models\CrawlJob::create([
				'event_id'=>$event->event_id
		]);
	}

}