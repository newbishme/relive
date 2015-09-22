<?php

require_once '/var/www/vendor/autoload.php';

use \relive\Crawlers\TwitterCrawler;
use \relive\Crawlers\InstagramCrawler;
use \relive\Crawlers\GPlusCrawler;

$twitter = TwitterCrawler::getInstance();
$instagram = InstagramCrawler::getInstance();
$gplus = GPlusCrawler::getInstance();

class PQCrawlJob extends SplPriorityQueue 
{ 
	public function compare($priority1, $priority2) { 
        if ($priority1 === $priority2) return 0; 
        return $priority1 < $priority2 ? 1 : -1; 
    } 
} 

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
					$gplus->recentCrawl($event, $hashtag->hashtag);
				}
				$job->delay = $job->delay*2;
				$job->save();
			}
			$top = $objPQ->top();
		}
	}

	$objPQ = new PQCrawlJob(); 
	$objPQ->setExtractFlags(PQCrawlJob::EXTR_BOTH); 
	$jobs = \relive\models\CrawlJob::where('isActive', '=', 1)->where('delay','<',1440)->get();
	$currentTime = time();
	foreach ($jobs as $job) {
		$objPQ->insert($job,$currentTime+($job->delay*60));
	}
	print "Sleep for 1 minute\n";
	sleep(60);
} 

