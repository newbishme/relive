<?php
require_once '/Users/quanyang/BitBucket/relive/vendor/autoload.php';
//require_once '/var/www/vendor/autoload.php';

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

if (isset($_GET)) {
	if (isset($_GET['publish'])) {
		$event = \relive\models\Event::find($_GET['publish']);
		$event->isPublished = 1;
		\relive\misc\FacebookPagePoster::post($event->event_id);
		\relive\models\CrawlJob::create(['event_id'=>$event->event_id]);
		$event->save();
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
}

if (!isset($_SESSION['login'])) {
	include './relive/templates/login.php';
} else {
	$unpublishedEvents = \relive\models\Event::where('isPublished','=','0')->get();
	$reportedPosts = \relive\models\Post::join('reports','posts.post_id','=','reports.post_id')->groupBy('posts.post_id')->selectRaw('*,(select count(*) from reports c where c.post_id = posts.post_id) as `count`')->where('isSettled','=',0)->orderBy('datetime','desc')->get();
	include './relive/templates/moderate.php';
}
