<?php

require_once '/var/www/vendor/autoload.php';

use relive\models\Event;
use Illuminate\Database\Eloquent\ModelNotFoundException;

$event_id = $argv[1];

if (isset($event_id)) {
	try {
		$event = Event::findOrFail($event_id);
		$fb = new \Facebook\Facebook([
			'app_id'	=>	getenv('FACEBOOK_APP_ID'),
			'app_secret' => getenv('FACEBOOK_APP_SECRET'),
			'default_graph_version' => 'v2.4',
			'default_access_token' => getenv('FACEBOOK_PAGE_TOKEN')
		]);

		$fbPageId = getenv('FACEBOOK_PAGE_ID');

		$sourceLink = "https://relive.space/#!/event.php?id=" . $event->event_id . "&name=" . rawurlencode($event->eventName);
		$fbPostMessage = "The event \"" . $event->eventName . "\" was just added to relive.space!\n\n" . $sourceLink;

		$response = $fb->post('/' . $fbPageId . '/feed', ['message' => $fbPostMessage]);

		echo json_encode($response);
	} catch (ModelNotFoundException $e) {
		echo "event not found!";
	}
}