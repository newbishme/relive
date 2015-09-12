<?php

namespace relive;

use relive\models;
use Slim\Slim;
use SlimJson\Middleware;
/**
 * Class App
 *
 * Main class of the REST API
 * @package relive
 */
class App {
    /**
     *  Construct a new App instance
     */
    public function __construct() {
        $this->app = new Slim();
        $this->startSession();
        $this->setupMiddleWare();
        $this->addDefaultRoutes();
    }

    /**
     *  Run the App instance
     */
    public function run() {
      $this->app->run();
    }

    private $app;

    private function startSession() {
        if(!session_id()) {
            session_start();
            date_default_timezone_set('Asia/Singapore');
        }
    }

    private function setupMiddleWare() {
        $this->app->add(new Middleware(array(
            'json.status' => false,
            'json.override_error' => true,
            'json.override_notfound' => true
        )));
    }

    private function addDefaultRoutes() {
        $app = $this->app;

        //$app->response->headers->set('Access-Control-Allow-Origin', '*');

        //  http://relive.space/api
        $app->group('', function() use ($app) {

            //  GET: /api
            $app->get('', function() use ($app) {
                $app->render(200, ['Status' => 'Running']);
            });

            $app->group('/hashtag', function() use ($app) {
                $app->get('/:hashtag', function($hashtag) use ($app) {
                    //return all events related to $hashtag
                });
            });            

            $app->group('/event', function() use ($app) {

                // Get /api/event{?startAt,limit,orderBy}
                $app->get('', function() use ($app) {
                    $allGetVars = $app->request->get();
                    //default startAt = 0, limit = 15
                    $startAt = @$allGetVars['startAt']? $allGetVars['startAt']: 0;
                    $limit = @$allGetVars['limit']? $allGetVars['limit']: 15; 
                    $orderBy = @$allGetVars['orderBy']? $allGetVars['orderBy']: "startDate";
                });

                // Post /api/event
                $app->post('', function() use ($app,$itemController) {
                    $jsonData = $app->request->getBody();
                    $allPostVars = json_decode($jsonData,true);

                    $eventName = $allPostVars['eventName'];
                    $hashtags = $allPostVars['hashtags'];
                });

                //  Get /api/event/indexes
                $app->get('/indexes', function() use ($app) {
                    //return hashtags/name/media
                });

                //  Get /api/event/recent
                $app->get('/recent', function() use ($app) {
                    $allGetVars = $app->request->get();
                    $limit = @$allGetVars['limit']? $allGetVars['limit']: 5;
                });

                //  Get /api/event/trending
                $app->get('/trending', function() use ($app) {
                    $allGetVars = $app->request->get();
                    $limit = @$allGetVars['limit']? $allGetVars['limit']: 5;
                });

                // Route /api/event/:event_id
                $app->group('/:event_id', function() use ($app,$itemController) {

                    //  Get /api/event/:event_id
                    $app->get('', function($event_id) use ($app,$itemController) {
                        //return event with id = :event_id
                    });

                    // Route /api/event/:event_id/post
                    $app->group('/post', function() use ($app) {
                        // Get {startAt,orderBY}
                        $app->get('', function($event_id) use ($app) {
                            //return all post
                            $allGetVars = $app->request->get();
                            //default startAt = 0, limit = 15
                            $startAt = @$allGetVars['startAt']? $allGetVars['startAt']: 0;
                            $orderBy = @$allGetVars['orderBy']? $allGetVars['orderBy']: "datetime";
                        });
                    });

                    // Route /api/event/:event_id/hashtag
                    $app->group('/hashtag', function() use ($app) {
                        // Get
                        $app->get('', function($event_id) use ($app) {
                        });

                        // Post
                        $app->post('', function($event_id) use ($app) {
                            $allPostVars = $app->request->post();
                            $message = @$allPostVars['hashtag']?$allPostVars['hashtag']:""; 
                        });

                        // Delete
                        $app->delete('/:hashtag', function($event_id, $hashtag) use ($app) {
                        });
                    });
                }
            });
        });
    }
}
