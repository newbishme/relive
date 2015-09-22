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
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="apple-touch-icon" sizes="57x57" href="//relive.space/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="//relive.space/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="//relive.space/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="//relive.space/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="//relive.space/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="//relive.space/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="//relive.space/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="//relive.space///relive.space/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="//relive.space/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="//relive.space///relive.space/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="//relive.space/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="//relive.space/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="//relive.space/favicon-16x16.png" sizes="16x16">
    <meta name="apple-mobile-web-app-title" content="relive">
    <meta name="application-name" content="relive">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="//relive.space/mstile-144x144.png">
    <meta name="theme-color" content="#374f59">
    <link href="apple-touch-startup-image-1536x2008.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1496x2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-768x1004.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 1) and (orientation: portrait)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-748x1024.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 1) and (orientation: landscape)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1242x2148.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-1182x2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-750x1294.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-640x1096.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-640x920.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">
    <link href="apple-touch-startup-image-320x460.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">
    <meta property="fb:app_id" content="1162812327066502" />
    <meta property="og:image"  content="<?php echo $event->image; ?>" />  
    <meta property="og:url" content="https://relive.space/event/<?php echo $event->event_id;?>" />
    <meta property="og:title" content="<?php echo $event->eventName; ?>" />
    <meta property="og:description" content="<?php echo $event->eventName." ".$event->caption; ?>" />
    <meta name="og:keywords" content="<?php echo $keyword;?>">
    <meta property="Description" content="<?php echo $event->eventName." ".$event->caption." ".$posts->first()->caption; ?>" />
    <meta name="Keywords" content="<?php echo $keyword;?>">
    <meta http-equiv="refresh" content="0; url=//relive.space/#!/event.php?id=<?php echo $event->event_id;?>" />
</head>
<FRAMESET rows="*,0">
    <FRAME src="//relive.space/#!/event.php?id=<?php echo $event->event_id;?>" frameborder="0" noresize>
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