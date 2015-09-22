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
						<form onsubmit='return confirm(\"Confirm publish?\");'>
						<input type='hidden' name='publish' value='$event->event_id'>
						Start date:<input class='startdate' type='text' name='start'>
						End date:<input class='enddate' type='text' name='end'>
						<input type='submit' value='PUBLISH!'>
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