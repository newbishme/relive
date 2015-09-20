<?php

require_once '/var/www/vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;

$twitter = TwitterCrawler::getInstance();
$instagram = InstagramCrawler::getInstance();

class PQCrawlJob extends SplPriorityQueue 
{ 
	public function compare($priority1, $priority2) { 
        if ($priority1 === $priority2) return 0; 
        return $priority1 < $priority2 ? 1 : -1; 
    } 
} 

$crawling = [];
$objPQ = new PQCrawlJob(); 
$objPQ->setExtractFlags(PQCrawlJob::EXTR_BOTH); 

while(true) {
	if ($objPQ->valid()) {
		$top = $objPQ->top();
		$currentTime = time();
		//if top's time is later than current, sleep.
		while ($top['priority'] <= $currentTime) {
			$queueObj = $objPQ->extract();
			$job = $queueObj['data'];
			$event = \relive\models\Event::find($job->event_id);
			if ($event) {
				print "Crawling for event:".$event->event_id."->".$event->eventName." with Delay:".$job->delay."\n";
				$hashtagRelationships = \relive\models\EventHashtagRelationship::where('event_id', '=', $job->event_id)->get();
				foreach ($hashtagRelationships as $hashtagRelationship) {
					$hashtag = \relive\models\Hashtag::find($hashtagRelationship->hashtag_id);
					$twitter->recentCrawl($currentTime, $event, $hashtag->hashtag);
					$instagram->recentCrawl($currentTime, $event, $hashtag->hashtag);
				}
				$job->delay = $job->delay*2;
				$job->save();
			}
			unset($crawling[$job->crawler_id]);
			$top = $objPQ->top();
		}
	}
	$jobs = \relive\models\CrawlJob::where('isActive', '=', 1)->where('delay','<',1440)->whereNotIn('event_id', $crawling)->get();
	$currentTime = time();
	foreach ($jobs as $job) {
		$crawling[$job->crawler_id]=$job->event_id;
		$objPQ->insert($job,$currentTime+($job->delay*60));
	}
	print "Sleep for 1 minute\n";
	sleep(60);
} 

