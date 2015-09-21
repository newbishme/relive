<?php
require_once '/var/www/vendor/autoload.php';

if (isset($_GET['event_id'])) {
    $event = \relive\models\SearchIndex::find($_GET['event_id']);
}

if($event) {
    $hashtags = \relive\models\Hashtag::whereIn('hashtag_id', function($query) use ($event) {
            $query->select('hashtag_id')->from('eventhashtagrelationships')->where('event_id','=',$event->event_id);
        })->select('hashtag')->get();
    $tags = [];
    foreach ($hashtags as $hashtag) {
        array_push($tags,$hashtag->hashtag);
    }
    $keyword = join(',',$tags);

    $posts = \relive\models\Post::whereIn('post_id', function($query) use ($event) {
            $query->select('post_id')->from('posteventrelationships')->where('event_id','=',$event->event_id)->where('isFiltered',False);
        })->orderBy('datetime','desc')->offset(0)->limit(15)->get();


} else {
    header("Location: http://relive.space/");
}

?>
<!DOCTYPE html>
<html lang="en">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb##">
    <meta charset="UTF-8">
    <title>relive</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="fb:app_id" content="1162812327066502" />
    <meta property="og:image"  content="<?php echo $event->image; ?>" />  
    <meta property="og:url" content="https://relive.space/event/<?php echo $event->event_id;?>" />
    <meta property="og:title" content="<?php echo $event->eventName; ?>" />
    <meta property="og:description" content="<?php echo $event->eventName." ".$event->caption; ?>" />
    <meta name="og:keywords" content="<?php echo $keyword;?>">
    <meta property="Description" content="<?php echo $event->eventName." ".$event->caption." ".$posts->first()->caption; ?>" />
    <meta name="Keywords" content="<?php echo $keyword;?>">
    <!--<meta http-equiv="refresh" content="0; url=https://relive.space/#!/event.php?id=<?php echo $event->event_id;?>" />-->
</head>
<FRAMESET rows="*,0">
    <FRAME src="https://relive.space/#!/event.php?id=<?php echo $event->event_id;?>" frameborder="0" noresize>
    <NOFRAMES>
       Your browser does not support frames.
       <?php
           foreach ($posts as $post) {
                print $post->author."\n";
                if ($post->media) {
                    print $post->media->data[0]->mediaURL;
                }
                print date('d-m-Y H:i:s',$post->datetime)."\n";
                print join(',',$post->hashtags)."\n";
                print $post->caption."\n\n";                
            }
       ?>
    </NOFRAMES>
</FRAMESET>
</html>