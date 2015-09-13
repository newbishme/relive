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
        $post = \relive\models\Post::firstOrCreate([
            'datetime'=>DateTime::setTimestamp(strtotime($status->created_at)),
            'postURL'=>"https://twitter.com/statuses/" . $status->id_str,
            'author'=>$status->user->screen_name,
            'caption'=>$status->text,
            'provider_id'=>$this->provider->provider_id
        ]);
        $relationship = \relive\models\PostEventRelationship::firstOrCreate([
            'event_id'=>$event->event_id,
            'post_id'=>$post->post_id,
            'isFiltered'=>0
        ]);
        return $post;
    }

    public function recentCrawl($keyword){
        $twitter = $this->twitter;
        $twitter->get("search/tweets", array('q' => $keyword, 'count' => 100, 'result_type'=>'recent'));
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
}