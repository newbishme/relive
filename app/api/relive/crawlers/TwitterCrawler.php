<?php

namespace relive\Crawlers;

use Abraham\TwitterOAuth\TwitterOAuth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TwitterCrawler extends \relive\Crawlers\Crawler {

    private $twitter;
    private $provider;

	private function __construct(){
        $access_token = getenv('TWITTER_ACCESS_TOKEN');
        $access_token_secret = getenv('TWITTER_ACCESS_TOKEN_SECRET');
        $api_key = getenv('TWITTER_API_KEY');
        $api_secret = getenv('TWITTER_API_SECRET');

        $this->twitter = new TwitterOAuth($api_key, $api_secret, $access_token, $access_token_secret);
        $this->provider = \relive\models\Provider::firstOrCreate(['providerName'=>'twitter','providerSite'=>'https://www.twitter.com/']);
	}

    public static function getInstance() {
        static $instance = null;
        if ($instance === null)
            $instance = new TwitterCrawler();
        return $instance;
    }

	public function popularCrawl($event, $keyword){
        $twitter = $this->twitter;
        $twitter->get("search/tweets", array('q' => $keyword, 'count' => 100, 'result_type'=>'popular'));
        $response = $twitter->getLastBody();
        $repeat = 2;
        if (isset($response->statuses)) {
            $statuses = $response->statuses;
            while ($twitter->getLastHttpCode() == 200 && count($statuses) > 0 && $repeat > 0) {
                foreach ($statuses as $status)
                    $this->createPost($event, $status);
                $twitter->get("search/tweets", array(
                    'q' => $keyword,
                    'count' => 100,
                    'result_type'=>'popular',
                    'max_id'=>$statuses[count($statuses)-1]->id_str
                ));
                $response = $twitter->getLastBody();
                $repeat--;
            }
        }
	}

    private function createPost($event, $status) {
        if (isset($status->retweeted_status) || isset($status->quoted_status))
            return null;
        $statusUrl = "https://twitter.com/statuses/" . $status->id_str;
        try {
            return \relive\models\Post::where('postURL', '=', $statusUrl)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            $rankPoints = $this->rankPost($status);
            //$datetime = new \DateTime();
            //$datetime->setTimestamp(strtotime($status->created_at));
            $post = \relive\models\Post::firstOrCreate([
                'datetime'=>strtotime($status->created_at),
                'postURL'=>htmlspecialchars($statusUrl, ENT_QUOTES, 'UTF-8'),
                'author'=>htmlspecialchars($status->user->screen_name, ENT_QUOTES, 'UTF-8'),
                'caption'=>htmlspecialchars($status->text, ENT_QUOTES, 'UTF-8'),
                'provider_id'=>$this->provider->provider_id,
                'rankPoints'=>$rankPoints
            ]);

            if (isset($status->entities->hashtags)) {
                $this->createHashtags($post, $status);
            }

            if (isset($status->entities->media)) {
                foreach($status->entities->media as $twitter_media) {
                    $media = \relive\models\Media::create(['post_id'=>$post->post_id, 'type'=>htmlspecialchars($twitter_media->type, ENT_QUOTES, 'UTF-8')]);
                    $this->createMediaUrls($media->media_id, $twitter_media);
                }
            }
            $relationship = \relive\models\PostEventRelationship::firstOrCreate([
                'event_id'=>$event->event_id,
                'post_id'=>$post->post_id,
                'isFiltered'=>0
            ]);
            return $post;
        }
    }

    private function createHashtags($post, $twitterPost) {
        $hashtags = $twitterPost->entities->hashtags;
        foreach ($hashtags as $tag) {
            $tagText = htmlspecialchars($tag->text, ENT_QUOTES, 'UTF-8');
            $hashtag = \relive\models\Hashtag::firstOrCreate(['hashtag' => $tagText]);
            $posthashtagrelationship = \relive\models\PostHashtagRelationship::firstOrCreate(['post_id'=>$post->post_id, 'hashtag_id' => $hashtag->hashtag_id]);
        }
    }

    private function createMediaUrls($media_id, $twitter_media) {
        if ($twitter_media->sizes->medium !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>htmlspecialchars($twitter_media->media_url_https . ':medium', ENT_QUOTES, 'UTF-8'),
                'width'=>$twitter_media->sizes->medium->w,
                'height'=>$twitter_media->sizes->medium->h,
                'sizes'=>'medium'
            ]);
        }
        if ($twitter_media->sizes->small !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>htmlspecialchars($twitter_media->media_url_https . ':small', ENT_QUOTES, 'UTF-8'),
                'width'=>$twitter_media->sizes->small->w,
                'height'=>$twitter_media->sizes->small->h,
                'sizes'=>'small'
            ]);
        }
        if ($twitter_media->sizes->large !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>htmlspecialchars($twitter_media->media_url_https . ':large', ENT_QUOTES, 'UTF-8'),
                'width'=>$twitter_media->sizes->large->w,
                'height'=>$twitter_media->sizes->large->h,
                'sizes'=>'large'
            ]);
        }
        if ($twitter_media->sizes->thumb !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>htmlspecialchars($twitter_media->media_url_https . ':thumb', ENT_QUOTES, 'UTF-8'),
                'width'=>$twitter_media->sizes->thumb->w,
                'height'=>$twitter_media->sizes->thumb->h,
                'sizes'=>'thumb'
            ]);
        }
    }

    private function rankPost($twitterPost) {
        $followingCount = $twitterPost->user->friends_count;
        $followersCount = $twitterPost->user->followers_count;
        $retweetCount = $twitterPost->retweet_count;
        $timeSincePost = time() - strtotime($twitterPost->created_at);
        $timeSincePost = $timeSincePost > 0 ? $timeSincePost : 1;

        $logFollowers = log10($followersCount + 2);
        $logFollowers = $logFollowers > 5 ? 5 : ($logFollowers < 0 ? 0 : $logFollowers);
        $powOneFiveFollowers = pow($logFollowers, 1.5);
        $logFollowing = log10($followingCount + 2);

        $seventyPercent = $powOneFiveFollowers * 30 / $logFollowing;
        $seventyPercent = $seventyPercent > 70 ? 70 : ($seventyPercent < 0 ? 0 : $seventyPercent);

        $thirtyPercent = log10($retweetCount + 2) * 150 / (log10($timeSincePost + 2)*$powOneFiveFollowers);
        $thirtyPercent = $thirtyPercent > 30 ? 30 : ($thirtyPercent < 0 ? 0 : $thirtyPercent);

        return $seventyPercent + $thirtyPercent;
    }

    public function recentCrawl($startTime, $event, $keyword){
        $twitter = $this->twitter;
        $twitter->get("search/tweets", array('q' => $keyword, 'count' => 100, 'result_type'=>'recent'));
        $response = $twitter->getLastBody();
        $repeat = 2;
        if (isset($response->statuses)) {
            $statuses = $response->statuses;
            while ($twitter->getLastHttpCode() == 200 && count($statuses) > 0 && $repeat > 0) {
                foreach ($statuses as $status)
                    if (strtotime($status->created_at) >= $startTime - 600) $this->createPost($event, $status);
                $twitter->get("search/tweets", array(
                    'q' => $keyword,
                    'count' => 100,
                    'result_type'=>'recent',
                    'max_id'=>$statuses[count($statuses)-1]->id_str
                ));
                $response = $twitter->getLastBody();
                $repeat--;
            }
        }
    }
}