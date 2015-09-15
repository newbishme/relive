<?php

namespace relive\Crawlers;

use MetzWeb\Instagram\Instagram;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InstagramCrawler extends \relive\Crawlers\Crawler {

    private $instagram;
    private $provider;

	private function __construct(){
        $this->instagram = new Instagram(array(
            'apiKey'      => getenv('INSTAGRAM_CLIENT_ID'),
            'apiSecret'   => getenv('INSTAGRAM_CLIENT_SECRET'),
            'apiCallback' => 'http://relive.space/'
        ));
        $access_token = getenv('INSTAGRAM_ACCESS_TOKEN');
        $this->instagram->setAccessToken($access_token);
        $this->provider = \relive\models\Provider::firstOrCreate(['providerName'=>'instagram','providerSite'=>'https://www.instagram.com/']);
	}

    public static function getInstance() {
        static $instance = null;
        if ($instance === null)
            $instance = new InstagramCrawler();
        return $instance;
    }

	public function recentCrawl($startTime, $event, $keyword){
        $response = $this->instagram->searchTags($keyword);
        $tags = $response->data;
        if (count($tags) != 0) {
            $tag = $tags[0]->name;
            $media = $this->instagram->getTagMedia($tag, 90);
            $count = 2;
            while (count($media->data)) {
                foreach ($media->data as $instaPost) {
                    if ($instaPost->created_time > $startTime - 600) {
                        $this->createPost($event, $instaPost);
                    } else {
                        return;
                    }
                }
                if ($count <= 0)
                    return;
                $count--;
                $media = $this->instagram->pagination($media, 90);                
            }
        }
	}

    public function initialCrawl($event, $keyword){
        $response = $this->instagram->searchTags($keyword);
        $tags = $response->data;
        if (count($tags) != 0) {
            $tag = $tags[0]->name;
            $media = $this->instagram->getTagMedia($tag, 90);
            $count = 3;
            while (count($media->data)) {
                foreach ($media->data as $instaPost) {
                    $this->createPost($event, $instaPost);
                }
                if ($count <= 0)
                    return;
                $count--;
                $media = $this->instagram->pagination($media, 90);                
            }
        }
    }

    private function createPost($event, $instaPost) {
        if ($instaPost->type === "image") {
            try {
                return \relive\models\Post::where('postURL', '=', $instaPost->link)->firstOrFail();
            } catch (ModelNotFoundException $e) {
                $datetime = new \DateTime();
                $datetime->setTimestamp($instaPost->created_time);
                $post = \relive\models\Post::firstOrCreate([
                    'datetime'=>$datetime,
                    'postURL'=>$instaPost->link,
                    'author'=>$instaPost->user->username,
                    'caption'=>$instaPost->caption->text,
                    'provider_id'=>$this->provider->provider_id
                ]);
                if (isset($instaPost->images)) {
                    $this->saveImageUrls($post, $instaPost->images);
                }
                $relationship = \relive\models\PostEventRelationship::firstOrCreate([
                    'event_id'=>$event->event_id,
                    'post_id'=>$post->post_id,
                    'isFiltered'=>0
                ]);
                return $post;
            }
        }
    }

    private function saveImageUrls($post, $instaImages) {
        $media = \relive\models\Media::create(['post_id'=>$post->post_id, 'type'=>'photo']);
        $media_id = $media->media_id;
        if (isset($instaImages->low_resolution)) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>$instaImages->low_resolution->url,
                'width'=>$instaImages->low_resolution->width,
                'height'=>$instaImages->low_resolution->height,
                'sizes'=>'low_resolution'
            ]);
        }
        if (isset($instaImages->thumbnail)) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>$instaImages->thumbnail->url,
                'width'=>$instaImages->thumbnail->width,
                'height'=>$instaImages->thumbnail->height,
                'sizes'=>'thumbnail'
            ]);
        }
        if (isset($instaImages->standard_resolution)) {
            $media_url = \relive\models\MediaURL::firstOrCreate([
                'media_id'=>$media_id,
                'mediaURL'=>$instaImages->standard_resolution->url,
                'width'=>$instaImages->standard_resolution->width,
                'height'=>$instaImages->standard_resolution->height,
                'sizes'=>'standard_resolution'
            ]);
        }
    }
}