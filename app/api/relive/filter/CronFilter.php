<?php

require_once '/var/www/vendor/autoload.php';

use \relive\models\Event;
use \relive\models\Post;
use \relive\models\PostEventRelationship;

foreach (Event::all() as $event) {
	$event_id = $event->event_id;
	$count = PostEventRelationship::where('event_id', '=', $event_id)->count();
	if ($count > 500) {
		$post = Post::whereIn('post_id', function($query) use ($event_id) {
		  $query->select('post_id')->from('posteventrelationships')->where('event_id','=',$event_id); 
		})->orderBy('rankPoints','asc')->offset($count * 0.35)->limit(1)->first();

		$rankPoints = $post->rankPoints;

		PostEventRelationship::whereIn('post_id', function($query) use ($rankPoints) {
			$query->select('post_id')->from('posts')->where('rankPoints', '<', $rankPoints);
		})->update(['isFiltered' => 1]);

		PostEventRelationship::whereIn('post_id', function($query) use ($rankPoints) {
			$query->select('post_id')->from('posts')->where('rankPoints', '>=', $rankPoints);
		})->update(['isFiltered' => 0]);
	}
}
