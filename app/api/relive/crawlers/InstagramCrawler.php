<?php

namespace relive\Crawlers;

use MetzWeb\Instagram\Instagram;

class InstagramCrawler extends \relive\Crawlers\Crawler {

    private $instagram;

	private function __construct(){
        $this->instagram = new Instagram(array(
            'apiKey'      => getenv('INSTAGRAM_CLIENT_ID'),
            'apiSecret'   => getenv('INSTAGRAM_CLIENT_SECRET'),
            'apiCallback' => 'http://relive.space/'
        ));
        $access_token = getenv('INSTAGRAM_ACCESS_TOKEN');
        $this->instagram->setAccessToken($access_token);
	}

    public static function getInstance() {
        static $instance = null;
        if ($instance === null)
            $instance = new InstagramCrawler();
        return $instance;
    }

	public function crawl($keyword){
        $response = $this->instagram->searchTags($keyword);

        $tags = $response->data;
        if (count($tags) != 0) {
            $tag = $tags[0]->name;
            $media = $this->instagram->getTagMedia($tag, 90);
            echo json_encode($media);
            while (count($media->data)) {
                $media = $this->instagram->pagination($media, 90);                
                echo json_encode($media);
            }
        } else {
            echo "error";
        }
	}
}