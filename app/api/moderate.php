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

if (isset($_GET)) {
	if (isset($_GET['publish'])) {
		$event = \relive\models\Event::find($_GET['publish']);
		$event->isPublished = 1;
		$event->save();
	}
	if (isset($_GET['post_id'])) {
		if (isset($_GET['filter'])) {
			$post = \relive\models\PostEventRelationship::whereIn('post_id', function($query) {
				$query->select('post_id')->from('reports')->where('post_id','=',$_GET['post_id']);
			})->first();
			$post->isFiltered = 1;
			$post->save();

			$report = \relive\models\Report::where('post_id','=',$_GET['post_id'])->first();
			$report->isSettled = 1;
			$report->save();
		} else if (isset($_GET['settle'])) {
			$report = \relive\models\Report::where('post_id','=',$_GET['post_id'])->first();
			$report->isSettled = 1;
			$report->save();
		}
	}
}

if (!isset($_SESSION['login'])) {
	include './relive/templates/login.php';
} else {
	$unpublishedEvents = \relive\models\Event::where('isPublished','=','0')->get();
	$reportedPosts = \relive\models\Post::whereIn('post_id', function($query) {
			$query->select('post_id')->from('reports')->where('isSettled','=','0');
		})->orderBy('datetime','desc')->get();

	include './relive/templates/moderate.php';
}
