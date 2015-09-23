<?php
require_once '/var/www/vendor/autoload.php';

if (session_status() == PHP_SESSION_NONE) {
	session_start();
}

if (isset($_POST)) {
	$error = 'Login failed!';
	if (isset($_POST['username'])&&isset($_POST['password'])) {
		$user = \relive\models\User::where('username','=',$_POST['username'])->where('password','=',md5($_POST['password']))->first();
		if ($user) {
			$_SESSION['login'] = $user->username;
			$error = '';
		}
	}
}

if (!isset($_SESSION['login'])) {
	include './relive/templates/login.php';
} else {
	if (isset($_GET)) {
		if (isset($_GET['publish'])) {
			$event = \relive\models\Event::find($_GET['event_id']);
			$event->isPublished = 1;
			if (isset($_GET['start'])) {
				$event->startDate = strtotime($_GET['start']);
			} 
			if (isset($_GET['end'])) {
				$event->endDate = strtotime($_GET['end']);
			}
			\relive\misc\FacebookPagePoster::post($event->event_id);
			\relive\models\CrawlJob::create(['event_id'=>$event->event_id]);
			$event->save();
		}
		if (isset($_GET['deleteevent'])) {
			$event_id = $_GET['event_id'];
			\relive\models\Event::find($event_id)->delete();
			\relive\models\Post::whereNotIn('post_id', function($query) {
				$query->select('post_id')->from('posteventrelationships');
			})->delete();
		}
		if (isset($_GET['post_id'])) {
			if (isset($_GET['filter'])) {
				$post = \relive\models\PostEventRelationship::whereIn('post_id', function($query) {
					$query->select('post_id')->from('reports')->where('post_id','=',$_GET['post_id']);
				})->first();
				$post->isFiltered = 1;
				$post->save();

				$report = \relive\models\Report::where('post_id','=',$_GET['post_id'])->get();
				foreach ($report as $rep) {
					$rep->isSettled = 1;
					$rep->save();
				}
			} else if (isset($_GET['settle'])) {
				$report = \relive\models\Report::where('post_id','=',$_GET['post_id'])->get();
				foreach ($report as $rep) {
					$rep->isSettled = 1;
					$rep->save();
				}
			}
		}
		if (isset($_GET['updateevent'])) {
			$event_id = $_GET['event_id'];
			$event = \relive\models\Event::find($event_id);
			$event->eventName = $_GET['eventName'];
			$event->startDate = strtotime($_GET['startDate']);
			$event->endDate = strtotime($_GET['endDate']);
			$event->save();

			\relive\models\EventHashtagRelationship::where('event_id', '=', $event_id)->delete();
			$hashtags = array();
			if (isset($_GET['hashtag1']) && $_GET['hashtag1'] !== '') $hashtags[] = $_GET['hashtag1'];
			if (isset($_GET['hashtag2']) && $_GET['hashtag2'] !== '') $hashtags[] = $_GET['hashtag2'];
			if (isset($_GET['hashtag3']) && $_GET['hashtag3'] !== '') $hashtags[] = $_GET['hashtag3'];
			foreach ($hashtags as $tag) {
				$hashtag = \relive\models\Hashtag::firstOrCreate(['hashtag' => $tag]);
				$eventhashtagrelationship = \relive\models\EventHashtagRelationship::firstOrCreate(['event_id'=>$event_id, 'hashtag_id' => $hashtag->hashtag_id]);
			}
		}
	}

	$unpublishedEvents = \relive\models\Event::where('isPublished','=','0')->get();
	$publishedEvents = \relive\models\Event::where('isPublished', '=', '1')->get();
	$reportedPosts = \relive\models\Post::join('reports','posts.post_id','=','reports.post_id')->groupBy('posts.post_id')->selectRaw('*,(select count(*) from reports c where c.post_id = posts.post_id) as `count`')->where('isSettled','=',0)->orderBy('datetime','desc')->get();
	include './relive/templates/moderate.php';
}
