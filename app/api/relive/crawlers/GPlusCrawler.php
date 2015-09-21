<?php

namespace relive\Crawlers;

use Illuminate\Database\Eloquent\ModelNotFoundException;

class GPlusCrawler extends \relive\Crawlers\Crawler {

    private $gplus;
    private $provider;

	private function __construct() {
        $client = new \Google_Client();
        $client->setApplicationName("Relive");
        $client->setDeveloperKey(getenv("GPLUS_API_KEY"));
        $this->gplus = new \Google_Service_Plus($client);
        $this->provider = \relive\models\Provider::firstOrCreate(['providerName'=>'google+','providerSite'=>'https://plus.google.com/']);
	}

    public static function getInstance() {
        static $instance = null;
        if ($instance === null)
            $instance = new GPlusCrawler();
        return $instance;
    }

	public function recentCrawl($event, $keyword){
        $repeat = 3;
        $nextPageToken = null;
        while ($repeat > 0) {
            if ($repeat === 3) {
                $params = array(
                    "maxResults"    =>  20,
                    "orderBy"       =>  "recent"
                );
            } else {
                $params = array(
                    "maxResults"    =>  20,
                    "orderBy"       =>  "recent",
                    "pageToken"     =>  $nextPageToken
                );
            }
            $response = $this->gplus->activities->search($keyword, $params);
            $items = $response->getItems();
            foreach ($items as $gPlusPost) {
                $this->createPost($event, $gPlusPost);
            }
            if (is_null($response->getNextPageToken())) {
                return;
            }
            $nextPageToken = $response->getNextPageToken();
            $repeat--;
        }
	}

    public function initialCrawl($event, $keyword){
        $repeat = 3;
        $nextPageToken = null;
        while ($repeat > 0) {
            if ($repeat === 3) {
                $params = array(
                    "maxResults"    =>  20,
                    "orderBy"       =>  "best"
                );
            } else {
                $params = array(
                    "maxResults"    =>  20,
                    "orderBy"       =>  "best",
                    "pageToken"     =>  $nextPageToken
                );
            }
            $response = $this->gplus->activities->search($keyword, $params);
            $items = $response->getItems();
            foreach ($items as $gPlusPost) {
                $this->createPost($event, $gPlusPost);
            }
            if (is_null($response->getNextPageToken())) {
                return;
            }
            $nextPageToken = $response->getNextPageToken();
            $repeat--;
        }
    }

    private function createPost($event, $gPlusPost) {
        if ($gPlusPost->verb === "post" && (!isset($gPlusPost->object->attachments)
            || $gPlusPost->object->attachments[0]->objectType === "photo"
            || $gPlusPost->object->attachments[0]->objectType === "album")) {
            try {
                return \relive\models\Post::where('postURL', '=', $gPlusPost->url)->firstOrFail();
            } catch (ModelNotFoundException $e) {
                $rankPoints = $this->rankPost($gPlusPost);
                $content = htmlspecialchars(strip_tags($gPlusPost->object->content), ENT_QUOTES, 'UTF-8');
                $post = \relive\models\Post::firstOrCreate([
                    'datetime'=>strtotime($gPlusPost->published),
                    'postURL'=>htmlspecialchars($gPlusPost->url, ENT_QUOTES, 'UTF-8'),
                    'author'=>htmlspecialchars($gPlusPost->actor->displayName, ENT_QUOTES, 'UTF-8'),
                    'caption'=>$content,
                    'provider_id'=>$this->provider->provider_id,
                    'rankPoints'=>$rankPoints
                ]);

                $this->createHashtags($post, $content);

                if (isset($gPlusPost->object->attachments)) {
                    if ($gPlusPost->object->attachments[0]->objectType === "photo") {
                        $media = \relive\models\Media::create(['post_id'=>$post->post_id, 'type'=>'photo']);
                        $this->saveImageUrls($media->media_id, $gPlusPost->object->attachments[0]->fullImage);
                    } else if ($gPlusPost->object->attachments[0]->objectType === "album") {
                        $media = \relive\models\Media::create(['post_id'=>$post->post_id, 'type'=>'photo']);
                        $thumbnails = $gPlusPost->object->attachments[0]->thumbnails;
                        foreach ($thumbnails as $thumbnail) {
                            $this->saveImageUrls($media->media_id, $gPlusPost->object->attachments[0]->image);
                        }
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
    }

    private function rankPost($gPlusPost) {
        $replies = $gPlusPost->object->replies->totalItems;
        $plusones = $gPlusPost->object->plusoners->totalItems;
        $reshares = $gPlusPost->object->resharers->totalItems;
        $sumTimeFive = ($replies + $plusones + $reshares + 3) * 5;
        return $sumTimeFive > 100 ? 100 : $sumTimeFive;
    }

    private function createHashtags($post, $content) {
        preg_match_all('/#([^\s]+)/', $content, $matches);
        $hashtags = $matches[1];
        foreach ($hashtags as $tag) {
            $tagText = htmlspecialchars($tag, ENT_QUOTES, 'UTF-8');
            $hashtag = \relive\models\Hashtag::firstOrCreate(['hashtag' => $tagText]);
            $posthashtagrelationship = \relive\models\PostHashtagRelationship::firstOrCreate(['post_id'=>$post->post_id, 'hashtag_id' => $hashtag->hashtag_id]);
        }
    }

    private function saveImageUrls($media_id, $gPlusImage) {
        $media_url = \relive\models\MediaURL::firstOrCreate([
            'media_id'=>$media_id,
            'mediaURL'=>htmlspecialchars($gPlusImage->url, ENT_QUOTES, 'UTF-8'),
            'width'=>$gPlusImage->width,
            'height'=>$gPlusImage->height,
            'sizes'=>'large'
        ]);
    }
}