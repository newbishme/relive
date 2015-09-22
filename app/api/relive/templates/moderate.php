<html>
<head>
	<link rel="stylesheet" href="/jquery-ui.min.css">
	<link rel="stylesheet" href="/jquery-ui.structure.min.css">
	<link rel="stylesheet" href="/jquery-ui.theme.min.css">
  <script src="/jquery.js"></script>
  <script src="/jquery-ui.min.js"></script>
	<style>
	body{
		background-color: #efeff4;
		margin:0px;
		padding:0px;
	}
	body,h1,h2,h3,h4,h5,h6{font-family:Oxygen,Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif}
	.container{margin:auto;width:80%;}
	.landing-header .landing-title {
    font-family: 'Patua One' !important;
    font-size: 10vh;
    font-weight: 400;
    margin: 0;
	}
	header {
		background:#374F59;
		padding:3px;
		color: white;
	}
	input {
		border-radius: 4px;
		outline: none;
		border: none;
		line-height: 23px;
		padding: 0px 4px;
		margin: 4px 0px;
	}
	.card {
		background-color: white;
		width:90%;
		padding:5px 20px;
		margin:10px 0px;
		box-shadow: 0px 1px 0px #333;
		overflow: auto;

	}
	td {
		width:50%;
		overflow:auto;
	}
	table,tr,td {
		padding-top:10px;
		vertical-align: top;
	}
	</style>
</head>
<body>
	<header>
		<div class="container">
			<h1 class="landing-title">moderator panel</h1>
		</div>
	</header>
	<div class="container">
		<table>
			<tr>
				<td>
					<?php
					echo '<h1>Unpublished Events</h1>';
					foreach ($unpublishedEvents as $event) {
						$date = date("d-m-Y H:i:s",$event->dateAdded);
						$hashtags = join(', ',$event->hashtags);
						$card = "
						<div class='card'>
						<h3 style='float:right'>$event->event_id</h3>
						<h2>$event->eventName</h2>
						Date added: $date</br>
						Hashtags: $hashtags</br>
						</br>
						<form onsubmit='return confirm(\"Confirm?\");'>
						<input type='hidden' name='event_id' value='$event->event_id'>
						Start date:<input class='startdate' type='text' name='start'>
						End date:<input class='enddate' type='text' name='end'>
						<input type='submit' name='publish' value='PUBLISH!'>
						<input type='submit' name='deleteevent' value='DELETE'>
						</form>
						</div>";
						print $card;
					}
					?>
				</td>
				<td>
					<?php
					echo '<h1>Reported Posts</h1>';
					foreach ($reportedPosts as $post) {
						$date = date("d-m-Y H:i:s",$post->report_time);
						$hashtags = join(', ',$post->hashtags);
						$image = '';
						if ($post->media) {
							$image = "<img width='400' src='".$post->media->data[0]->mediaURL."'/>";
						}
						$card = "
						<div class='card'>
						$image
						<h3 style='float:right'>$post->post_id</h3></br>
						<h3>$post->author</h3>
						Report Count: $post->count</br>
						Date added: $date</br>
						Hashtags: $hashtags</br>
						$post->caption</br>
						</br>
						<form onsubmit='return confirm(\"Confirm?\");'>
						<input type='hidden' name='post_id' value='$post->post_id'>
						<input type='submit' name='filter' value='FILTER'> or 
						<input type='submit' name='settle' value='IGNORE'>
						</form>
						</div>";
						print $card;
					}
					?>
				</td>
			</tr>
		</table>
	</div>
	<div class="container">
		<h1>Published Events</h1>
		<table border="1">
			<tr>
				<td>ID</td>
				<td>Name</td>
				<td>Date Added</td>
				<td>Start Date</td>
				<td>End Date</td>
				<td>Rank Points</td>
				<td>Hashtag1</td>
				<td>Hashtag2</td>
				<td>Hashtag3</td>
				<td>Update/Delete</td>
			</tr>
			<?php
				foreach ($publishedEvents as $event) {
					$dateAdded = date("D M j Y H:i:s O",$event->dateAdded);
					$startDate = date("D M j Y H:i:s O",$event->startDate);
					$endDate = date("D M j Y H:i:s O",$event->endDate);
					$hashtag1 = isset($event->hashtags[0]) ? $event->hashtags[0] : '';
					$hashtag2 = isset($event->hashtags[1]) ? $event->hashtags[1] : '';
					$hashtag3 = isset($event->hashtags[2]) ? $event->hashtags[2] : '';
					$row = "
					<tr>
					<form onsubmit='return confirm(\"Update event?\");'>
					<input type='hidden' name='event_id' value='$event->event_id'>
					<td>$event->event_id</td>
					<td><input name='eventName' value='$event->eventName'></td>
					<td>$dateAdded</td>
					<td><input class='startdate' name='startDate' value='$startDate'</td>
					<td><input class='enddate' name='endDate' value='$endDate'</td>
					<td>$event->rankPoints</td>
					<td><input name='hashtag1' value='$hashtag1'></td>
					<td><input name='hashtag2' value='$hashtag2'></td>
					<td><input name='hashtag3' value='$hashtag3'></td>
					<td><input type='submit' name='updateevent' value='UPDATE'>or<input type='submit' name='deleteevent' value='DELETE'></td>
					</form>
					</tr>
					";
					print $row;
				}
			?>
		</table>
	</div>
	<script type="text/javascript">
		$(function() {
			$( ".startdate" ).datepicker({
				dateFormat: 'D M d yy',
				onSelect: function(dateText) {
					$(this).val(dateText + " 00:00:00 +0800");
				}
			});
			$( ".enddate" ).datepicker({
				dateFormat: 'D M d yy',
				onSelect: function(dateText) {
					$(this).val(dateText + " 23:59:59 +0800");
				}
			});
		});
	</script>
</body>
</html>