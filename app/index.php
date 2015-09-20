<!DOCTYPE html>
<html manifest="cache.manifest">
  <head>
    <?php include "head.php" ?>
  </head>
  <body>
    <?php include_once "googleanalytics.php" ?>
    <div class="statusbar-overlay"></div>
    <div class="panel-overlay"></div>

    <!-- Panel View Left -->
    <div class="panel panel-left panel-cover layout-dark">
      <div class="content-block-title">Relive</div>
      <div class="content-block">
        <p>The most convenient space to find, create, and view past events.</a></p>
      </div>

      <div class="content-block-title">Trending events</div>
      <div class="list-block">
        <ul>
          <div id="side-nav-trending-events"></div>
          <script id="sideNavTrendingEventTemplate" type="text/template7">
            <li>
              <a href="event.php?id={{event_id}}&name={{eventName}}" class="item-link close-panel">
                <div class="item-content">
                  <div class="item-media"><i class="icon ion-arrow-graph-up-right"></i></div>
                  <div class="item-inner">
                    <div class="item-title">{{eventName}}</div>
                  </div>
                </div>
              </a>
            </li>
          </script>
        </ul>
      </div>

      <div class="content-block-title">Can't find your event?</div>
      <div class="content-block">
        <a href="form.php" class="button button-fill button-big color-orange close-panel">Make a Reel</a>
      </div>
    </div>

    <!-- Views -->
    <div class="views">
      <!-- Your main view, should have "view-main" class -->
      <div class="view view-main">
        
        <!-- Top Navbar-->
        <div class="navbar hidden">
          <div class="navbar-inner" >
            <div class="left"></div>
            <div class="center sliding" id="page-title">relive</div>
            <div class="right">
              <a href="#" class="link icon-only open-panel"><i class="icon ion-ios-more"></i></a>
            </div>
          </div>
        </div>
        
        <!-- Pages container, because we use fixed-through navbar and toolbar, it has additional appropriate classes-->
        <div class="pages navbar-through">
            <div class="page" data-page="landing">
              <div class="page-content landing-content">
                <div class="landing-header">
                  <h1 class="landing-title">relive</h1>
                  <h4 class="landing-caption">Find interesting stories from various social media platforms
                      to relive these moments</h4>
                  <form class="landing-searchbar searchbar">
                    <div class="searchbar-input">
                      <input type="search" placeholder="Look for an event to relive">
                      <a href="#" class="searchbar-clear"></a>
                    </div>
                  </form>
                  <a href="events.php" class="discover">
                    <h4 class="discover-caption">Discover<i class="icon ion-chevron-right"></i></h4>
                  </a>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <script type="text/javascript" src="assets/javascript/framework7.min.js"></script>
    <script type="text/javascript" src="assets/javascript/my-app.js"></script>
  </body>
</html>
