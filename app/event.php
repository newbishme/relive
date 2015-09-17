<?php include_once "googleanalytics.php" ?>
<div class="navbar">
  <div class="navbar-inner">
    <div class="left sliding"><a href="index.php" class="back link"><i class="icon ion-ios-arrow-back"></i><span>Back</span></a></div>
    <div class="center sliding title-event-name">Event name</div>
    <div class="right"><a href="#" class="open-panel link icon-only"><i class="icon ion-ios-more"></i></a></div>
  </div>
</div>

<div class="pages navbar-through">
  <div data-page="event" class="page">
    <div class="page-content infinite-scroll" data-distance="200">
      <div class="content-block">
        <p>Relive the magical moments from this occasion.</p>
      </div>
      <div class="list-block virtual-list"></div>
      <!-- Preloader -->
      <div class="infinite-scroll-preloader">
        <div class="preloader"></div>
      </div>
    </div>
  </div>
</div>
