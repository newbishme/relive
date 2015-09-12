<?php

namespace relive\controllers;

class EventController extends Controller {

	public function __construct() {
	}

	public static function create() {
		$app = \Slim\Slim::getInstance();
        $jsonData = $app->request->getBody();
        //$allPostVars = json_decode($jsonData,true);
        $allPostVars = $app->request->post();
        $eventName = @$allPostVars['relive-event-name']?@$allPostVars['relive-event-name']:NULL;
        $hashtags = @$allPostVars['relive-hashtags']?$allPostVars['relive-hashtags']:[];	

        if (is_null($eventName)||strlen($eventName)==0||count($hashtags)==0) {
        	$app->render(400, ['Status' => 'Invalid input.' ]);
        	return;
        }
        
        try {
	        $event = new \relive\models\Event;
	        $event->eventName = $eventName;
			$event->save();

			foreach($hashtags as $tag) {
				$hashtag = \relive\models\Hashtag::firstOrCreate(['hashtag' => $tag]);
				$hashtag = \relive\models\Hashtag::where('hashtag', $tag)->first();
				$eventhashtagrelationship = \relive\models\EventHashtagRelationship::firstOrCreate(['event_id'=>$event->id, 'hashtag_id' => $hashtag->hashtag_id]);
			}
			$app->render(200, $event->toArray());
		} catch (\Exception $e) {
			$app->render(500, ['Status' => 'An error occurred.' ]);
		}

	}

};