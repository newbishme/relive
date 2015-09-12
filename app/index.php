<!DOCTYPE html>
<html>
  <head>
    <!-- Required meta tags-->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href='https://fonts.googleapis.com/css?family=Oxygen:400,300,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <title>relive</title>
    <link rel="apple-touch-icon" sizes="57x57" href="/assets/img/favicons/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/assets/img/favicons/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/assets/img/favicons/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/assets/img/favicons/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/assets/img/favicons/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/assets/img/favicons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/assets/img/favicons/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/img/favicons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicons/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="/assets/img/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/assets/img/favicons/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/assets/img/favicons/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/assets/img/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/assets/img/favicons/manifest.json">
    <link rel="shortcut icon" href="/assets/img/favicons/favicon.ico">
    <meta name="apple-mobile-web-app-title" content="relive">
    <meta name="application-name" content="relive">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="/assets/img/favicons/mstile-144x144.png">
    <meta name="msapplication-config" content="/assets/img/favicons/browserconfig.xml">
    <meta name="theme-color" content="#374f59">
    <link rel="apple-touch-startup-image" href="/assets/img/relive-startup.png">
  </head>
  <body>
    <!-- Status bar overlay for full screen mode (PhoneGap) -->
    <div class="statusbar-overlay"></div>

    <!-- Panel overlay app when opened -->
    <div class="panel-overlay"></div>

    <!-- Panel View Left -->
    <div class="panel panel-left panel-cover">
      <div class="view panel-view">
        <div class="content-block">
          <p>Left panel content</p>
        </div>
      </div>
    </div>

    <!-- Views -->
    <div class="views">
      <!-- Your main view, should have "view-main" class -->
      <div class="view view-main">

        <!-- Top Navbar-->
        <div class="navbar">
          <div class="navbar-inner">
            <div class="center sliding" id="page-title">relive</div>
            <div class="right">
              <a href="#" class="link icon-only open-panel"><i class="icon ion-ios-more"></i></a>
            </div>

            <!-- Sub navbar -->
            <div class="subnavbar">
              <div class="subnavbar-search">
                <form class="searchbar">
                  <div class="searchbar-input">
                    <input type="search" placeholder="Look for an event to relive">
                    <a href="#" class="searchbar-clear"></a>
                  </div>
                  <a href="#" class="searchbar-cancel">Cancel</a>
                </form>
              </div>
            </div>
          </div>
        </div>


        <!-- Pages container, because we use fixed-through navbar and toolbar, it has additional appropriate classes-->
        <div class="pages navbar-through">
            <div class="page with-subnavbar" data-page="home">

              <!-- Searchbar overlay -->
              <div class="searchbar-overlay"></div>

              <div class="page-content">
                <!--<div class="content-block">
                  <p>The most awesome space to relive your moments</p>
                </div>-->

                <!-- Hidden by default, this will appear when search results is empty -->
                <div class="content-block searchbar-not-found">
                  <!-- Make a Reel CTA -->
                  <div class="row no-gutter">
                    <div class="col col-5"></div>
                    <div class="col col-90">
                      <a href="form.html" class="button button-fill button-big color-orange">Make a Reel</a>
                    </div>
                    <div class="col col-5"></div>
                  </div>
                </div>

                <div class="content-block-title">Trending events</div>
                <div class="list-block list-block-search virtual-list searchbar-found" id="home-landing-events"></div>
                <!-- <script id="homeTemplate" type="text/template7">
                  {{eventName}}
                </script> -->

              </div>
            </div>
        </div>


      </div>
    </div>
    <!-- Path to Framework7 Library JS-->
    <script type="text/javascript" src="assets/javascript/framework7.min.js"></script>
    <!-- Path to your app js-->
    <script type="text/javascript" src="assets/javascript/my-app.js"></script>
  </body>
</html>
