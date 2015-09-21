<?php

namespace relive\Crawlers;

use Illuminate\Database\Eloquent\ModelNotFoundException;

class GPlusCrawler extends \relive\Crawlers\Crawler {

    private $provider;

	private function __construct(){
        $this->provider = \relive\models\Provider::firstOrCreate(['providerName'=>'google+','providerSite'=>'https://plus.google.com/']);
	}

    public static function getInstance() {
        static $instance = null;
        if ($instance === null)
            $instance = new GPlusCrawler();
        return $instance;
    }

	public function recentCrawl($startTime, $event, $keyword){
        
	}

    public function initialCrawl($event, $keyword){
        
    }

    private function createPost($event, $gPlusPost) {
        
    }

    private function rankPost($gPlusPost) {

    }

    private function createHashtags($post, $gPlusPost) {

    }

    private function saveImageUrls($post, $instaImages) {

    }
}