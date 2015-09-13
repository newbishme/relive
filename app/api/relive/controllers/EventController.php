<?php

namespace relive\controllers;

class EventController extends Controller {

	public function __construct() {
	}

	public static function getEvents() {
		$app = \Slim\Slim::getInstance();

		$allGetVars = $app->request->get();
        $startAt = @$allGetVars['startAt']? intval($allGetVars['startAt']): 0;
        $limit = @$allGetVars['limit']? $allGetVars['limit']: 15; 
        //either dateAdded or startDate
        $orderBy = @$allGetVars['orderBy']? $allGetVars['orderBy']: "startDate";

        if (!filter_var($limit, FILTER_VALIDATE_INT)) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }

        if ($orderBy != "dateAdded") {
        	$orderBy = "startDate";
        }

        $event = \relive\models\Event::orderBy($orderBy,'desc')->skip($startAt)->take($limit)->get()->toArray();
        echo json_encode($event, JSON_UNESCAPED_SLASHES);
	}

	public static function getPostsForEvent($event_id) {
		$app = \Slim\Slim::getInstance();
        //return all post
        $allGetVars = $app->request->get();
        //default startAt = 0, limit = 15
        $startAt = @$allGetVars['startAt']? intval($allGetVars['startAt']): 0;
        $limit = @$allGetVars['limit']? $allGetVars['limit']: 15; 
        $orderBy = @$allGetVars['orderBy']? $allGetVars['orderBy']: "datetime";

        if (!filter_var($event_id, FILTER_VALIDATE_INT)|| !filter_var($limit, FILTER_VALIDATE_INT)) {
        	$app->render(400, ['Status' => 'Invalid event id.' ]);
        	return;
        }

        if ($orderBy != "post_id") {
        	$orderBy = "datetime";
        }

        $event = \relive\models\Event::find($event_id);
       	if ($event) {
       		$posts = array_slice($event->toArray()['posts'],$startAt, $limit);
       		echo json_encode($posts, JSON_UNESCAPED_SLASHES);
       	} else {
       		$app->render(404, ['Status','Event not found.']);
       	}
	}

	public static function getHashtagForEvent($event_id) {
		$app = \Slim\Slim::getInstance();

        if (!filter_var($event_id, FILTER_VALIDATE_INT)) {
        	$app->render(400, ['Status' => 'Invalid event id.' ]);
        	return;
        }
       	$event = \relive\models\Event::find($event_id);
       	if ($event) {
       		$hashtags = $event->toArray()['hashtags'];
       		echo json_encode($hashtags, JSON_UNESCAPED_SLASHES);
       	} else {
       		$app->render(404, ['Status','Event not found.']);
       	}
	}

	public static function getEventWithId($event_id) {
		$app = \Slim\Slim::getInstance();

        if (!filter_var($event_id, FILTER_VALIDATE_INT)) {
        	$app->render(400, ['Status' => 'Invalid event id.' ]);
        	return;
        }
       	$event = \relive\models\Event::find($event_id);
       	if ($event) {
       		echo json_encode($event, JSON_UNESCAPED_SLASHES);
       	} else {
       		$app->render(404, ['Status','Event not found.']);
       	}
	}

	public static function getTrendingEvents() {
		$app = \Slim\Slim::getInstance();
        $allGetVars = $app->request->get();
        $limit = @$allGetVars['limit']? $allGetVars['limit']: 5;

        if (!filter_var($limit, FILTER_VALIDATE_INT)) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }

		$events = \relive\models\Event::orderBy('rankPoints','desc')->take($limit)->select('event_id','eventName')->get()->toArray();
		echo json_encode($events, JSON_UNESCAPED_SLASHES);
	}

	public static function getRecentEvents() {
		$app = \Slim\Slim::getInstance();
        $allGetVars = $app->request->get();
        $limit = @$allGetVars['limit']? $allGetVars['limit']: 5;

        if (!filter_var($limit, FILTER_VALIDATE_INT)) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }

		$events = \relive\models\Event::orderBy('dateAdded','desc')->take($limit)->select('event_id','eventName')->get()->toArray();
		echo json_encode($events, JSON_UNESCAPED_SLASHES);
	}

	public static function getSearchIndexes() {
		//return eventname/media/hashtags
		$app = \Slim\Slim::getInstance();
		$allGetVars = $app->request->get();
		$startAt = @$allGetVars['startAt']? intval($allGetVars['startAt']): 0;


		$count = \relive\models\SearchIndex::count();
		if ($startAt >= $count) {
			echo json_encode([]);
			return;
		}
		$limit = $count-$startAt;
		$indexes = \relive\models\SearchIndex::select('event_id','eventName')->orderBy('event_id','desc')->skip($startAt)->take($limit)->get()->toArray();
		echo json_encode($indexes, JSON_UNESCAPED_SLASHES);
	}

	public static function create() {
		$app = \Slim\Slim::getInstance();
        $jsonData = $app->request->getBody();
        //$allPostVars = json_decode($jsonData,true);
        $allPostVars = $app->request->post();
        $eventName = @$allPostVars['relive-event-name']?@trim($allPostVars['relive-event-name']):NULL;
        $hashtags = @$allPostVars['relive-hashtags']?$allPostVars['relive-hashtags']:[];	

        if (is_null($eventName)||empty($eventName)||strlen($eventName) > 255||count($hashtags)==0) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }
        try {
	        $event = \relive\models\Event::firstOrCreate(['eventName' => $eventName]);

			foreach($hashtags as $tag) {
				$tag = trim($tag);
				if (!empty($tag) && strlen($tag) < 255) {
					$hashtag = \relive\models\Hashtag::firstOrCreate(['hashtag' => $tag]);
					$eventhashtagrelationship = \relive\models\EventHashtagRelationship::firstOrCreate(['event_id'=>$event->event_id, 'hashtag_id' => $hashtag->hashtag_id]);
				}
			}
			\relive\Crawlers\CreationCrawler::initialCrawl($event);
			echo json_encode($event, JSON_UNESCAPED_SLASHES);
		} catch (\Exception $e) {
			$app->render(500, ['Status' => 'An error occurred.' ]);
		}
	}

	public static function addHashtagToEvent($event_id) {
		$app = \Slim\Slim::getInstance();

        $allPostVars = $app->request->post();
        $hashtag = @$allPostVars['hashtag']?trim($allPostVars['hashtag']):NULL;

        if (!filter_var($event_id, FILTER_VALIDATE_INT)||is_null($hashtag)||strlen($hashtag)>255||empty($hashtag)) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }

       	$event = \relive\models\Event::find($event_id);
       	$hashtag = \relive\models\Hashtag::firstOrCreate(['hashtag' => $hashtag]);
		$eventhashtagrelationship = \relive\models\EventHashtagRelationship::firstOrCreate(['event_id'=>$event->event_id, 'hashtag_id' => $hashtag->hashtag_id]);
       	if ($event) {
       		echo json_encode($event, JSON_UNESCAPED_SLASHES);
       	} else {
       		$app->render(404, ['Status','Event not found.']);
       	}
	}
};