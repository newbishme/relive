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
            <div class="left">
              <a href="#" class="link icon-only">
                <i class="icon icon-back"></i>
              </a>
            </div>

            <div class="center sliding" id="page-title">relive</div>

            <div class="right">
              <a href="#" class="link icon-only">
                <i class="icon icon-bars"></i>
              </a>
            </div>

            <!-- Sub navbar -->
            <div class="subnavbar">
              <div class="subnavbar-search">
                <form class="searchbar">
                  <div class="searchbar-input">
                    <input type="search" placeholder="Find an event to relive">
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

              <div class="page-content">
                <p>The most awesome space to relive your moments</p>

                <div id="home-landing-events"></div>
                <script id="homeTemplate" type="text/template7">
                  {{eventName}}
                </script>

                <!-- Link to another page -->
                <a href="form.html">Make a Reel</a>
                <a href="#" data-panel="left" class="open-panel">Open left panel</a>
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
