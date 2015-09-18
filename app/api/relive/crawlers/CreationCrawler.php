<?php
namespace relive\Crawlers;

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

class CreationCrawler extends \relive\Crawlers\Crawler {

	public $event;

	public function __construct($arg) {
		$this->$event = $arg;
	}

	public function run() {
        if ($this->event) {
            $this->initialCrawl();
        }
    }

	public function initialCrawl () {
		$twitterCrawler = TwitterCrawler::getInstance();
		$instagramCrawler = InstagramCrawler::getInstance();
		$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $this->event->event_id)->get();
		foreach ($hashtagRelationships as $hashtagRelationship) {
			$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
			$twitterCrawler->popularCrawl($this->event, $hashtag->hashtag);
			$instagramCrawler->initialCrawl($this->event, $hashtag->hashtag);
		}
		\relive\models\CrawlJob::create([
				'event_id'=>$this->event->event_id
		]);
	}
}