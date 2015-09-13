<?php

namespace relive\controllers;

class EventController extends Controller {

	public function __construct() {
	}

	public static function getTrendingEvents() {
		$app = \Slim\Slim::getInstance();
        $allGetVars = $app->request->get();
        $limit = @$allGetVars['limit']? $allGetVars['limit']: 5;

        if (!is_int(intval($limit))) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }

		$app->render(200,\relive\models\Event::orderBy('dateAdded','desc')->take($limit)->select('event_id','eventName')->get()->toArray());        
	}

	public static function getRecentEvents() {
		$app = \Slim\Slim::getInstance();
        $allGetVars = $app->request->get();
        $limit = @$allGetVars['limit']? $allGetVars['limit']: 5;

        if (!is_int(intval($limit))) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }

		$app->render(200,\relive\models\Event::orderBy('dateAdded','desc')->take($limit)->select('event_id','eventName')->get()->toArray());        
	}

	public static function getSearchIndexes() {
		//return eventname/media/hashtags
		$app = \Slim\Slim::getInstance();

		$app->render(200,\relive\models\SearchIndex::all()->toArray());
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
			$app->render(200, $event->toArray());
		} catch (\Exception $e) {
			print $e;
			$app->render(500, ['Status' => 'An error occurred.' ]);
		}
	}

};