<!-- Top Navbar-->
<div class="navbar">
  <div class="navbar-inner" >
    <div class="left sliding"><a href="index.php" class="back link" data-forceUrl="true"><i class="icon ion-ios-arrow-back"></i><span>Back</span></a></div>
    <div class="center sliding" id="page-title">relive</div>
    <div class="right">
      <a href="#" class="link icon-only open-panel"><i class="icon ion-ios-more"></i></a>
    </div>

    <!-- Sub navbar -->
    <div class="subnavbar">
      <div class="subnavbar-search">
        <form class="searchbar">
          <div class="searchbar-input">
            <input id="search-input-box" type="search" placeholder="Look for an event to relive">
            <a href="#" class="searchbar-clear"></a>
          </div>
          <a href="#" class="searchbar-cancel">Cancel</a>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="page with-subnavbar" data-page="events">
  <div class="searchbar-overlay"></div>
  <div class="page-content pull-to-refresh-content" data-ptr-distance="55">
    <div class="pull-to-refresh-layer">
      <div class="preloader"></div>
      <div class="pull-to-refresh-arrow"></div>
    </div>
    <!-- Hidden by default, this will appear when search results is empty -->
    <div class="content-block searchbar-not-found">
      <!-- Make a Reel CTA -->
      <div class="content-block-title">Can't find your event?</div>
      <div class="content-block">
        <a href="form.php" class="button button-fill button-big color-orange">Make a Reel</a>
      </div>
    </div>

    <div id="events" class="list-block list-block-search virtual-list searchbar-found" id="home-landing-events"></div>

  </div>
</div>