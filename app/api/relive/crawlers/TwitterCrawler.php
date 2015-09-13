<?php

namespace relive\Crawlers;

use Abraham\TwitterOAuth\TwitterOAuth;

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
        while ($twitter->getLastHttpCode() == 200 && $response->search_metadata->count > 0 && $repeat > 0) {
            $statuses = $response->statuses;
            foreach ($statuses as $status) {
                $this->createPost($event, $status);
            }
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

    private function createPost($event, $status) {
        $datetime = new DateTime();
        $datetime->setTimestamp(strtotime($status->created_at));
        $post = \relive\models\Post::firstOrCreate([
            'datetime'=>$datetime,
            'postURL'=>"https://twitter.com/statuses/" . $status->id_str,
            'author'=>$status->user->screen_name,
            'caption'=>$status->text,
            'provider_id'=>$this->provider->provider_id
        ]);
        foreach($status->entities->media as $twitter_media) {
            $media = \relive\models\Media::create(['post_id'=>$post->post_id, 'type'=>$twitter_media->type]);
            $this->createMediaUrls($media->media_id, $twitter_media);
        }
        $relationship = \relive\models\PostEventRelationship::firstOrCreate([
            'event_id'=>$event->event_id,
            'post_id'=>$post->post_id,
            'isFiltered'=>0
        ]);
        return $post;
    }

    private function createMediaUrls($media_id, $twitter_media) {
        if ($twitter_media->sizes->medium !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media->media_id,
                'mediaURL'=>$twitter_media->media_url_https . ':medium',
                'width'=>$twitter_media->sizes->medium->w,
                'height'=>$twitter_media->sizes->medium->h,
                'sizes'=>'medium'
            ]);
        }
        if ($twitter_media->sizes->small !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media->media_id,
                'mediaURL'=>$twitter_media->media_url_https . ':small',
                'width'=>$twitter_media->sizes->small->w,
                'height'=>$twitter_media->sizes->small->h,
                'sizes'=>'small'
            ]);
        }
        if ($twitter_media->sizes->large !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media->media_id,
                'mediaURL'=>$twitter_media->media_url_https . ':large',
                'width'=>$twitter_media->sizes->large->w,
                'height'=>$twitter_media->sizes->large->h,
                'sizes'=>'large'
            ]);
        }
        if ($twitter_media->sizes->thumb !== null) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media->media_id,
                'mediaURL'=>$twitter_media->media_url_https . ':thumb',
                'width'=>$twitter_media->sizes->thumb->w,
                'height'=>$twitter_media->sizes->thumb->h,
                'sizes'=>'thumb'
            ]);
        }
    }

    public function recentCrawl($startTime, $keyword){
        $twitter = $this->twitter;
        $twitter->get("search/tweets", array('q' => $keyword, 'count' => 100, 'result_type'=>'recent'));
        $response = $twitter->getLastBody();
        $repeat = 2;
        while ($twitter->getLastHttpCode() == 200 && $response->search_metadata->count > 0 && $repeat > 0) {
            $statuses = $response->statuses;
            foreach ($statuses as $status) {
                if (strtotime($status->created_at) >= $startTime - 600) {
                    $this->createPost($event, $status);       
                } else {
                    return;
                }
            }
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