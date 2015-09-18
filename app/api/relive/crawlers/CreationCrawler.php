<?php
namespace relive\Crawlers;

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

class CreationCrawler extends \relive\Crawlers\Crawler {

	public static function initialCrawl ($event) {
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
	}

}

class AsyncCreationCrawler extends CreationCrawler {
	public $event;

    public function __construct($event) {
        $this->event = $event;
    }

	public function run() {
		if (($event = $this->event)) {
            /*
             * If a large amount of data is being requested, you might want to
             * fsockopen and read using usleep in between reads
             */
            $this->initialCrawl($event);
        } 

	}
}