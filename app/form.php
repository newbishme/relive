<!-- We don't need full layout here, because this page will be parsed with Ajax-->
<!-- Top Navbar-->
<div class="navbar">
  <div class="navbar-inner">
    <div class="left"><a href="events.php" class="back link"> <i class="icon ion-ios-arrow-back"></i><span>Back</span></a></div>
    <div class="center sliding">Start a Reel</div>
    <div class="right">
      <a href="#" class="link icon-only open-panel"><i class="icon ion-more"></i></a>
    </div>
  </div>
</div>
<div class="pages">
  <!-- Page, data-page contains page name-->
  <div data-page="form" class="page">
    <!-- Scrollable page content-->
    <div class="page-content">
      <form action="https://relive.space/api/event" method="POST" class="ajax-submit" id="create-reel-form">
        <div class="content-block-title" id="event-name-header">Event Name</div>
        <div class="list-block">
          <ul>
            <li>
              <div class="item-content">
                <div class="item-media" id="event-name-input-icon"><i class="icon ion-edit"></i></div>
                <div class="item-inner">
                  <div class="item-input">
                    <input class="event-name-input" type="text" placeholder="Your event name" name="relive-event-name"/>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="content-block-title" id="hashtags-header">Add up to 3 hashtags</div>
        <div class="list-block">
          <ul>
            <li>
              <div class="item-content hashtags hidden">
              </div>
            </li>
            <li>
              <div class="item-content">
                <div class="item-media" id="hashtags-input-icon"><i class="icon ion-pound"></i></div>
                <div class="item-inner">
                  <div class="item-input">
                    <input class="hashtags-input" type="text" placeholder="Add hashtags linked to this event" name="relive-hashtags[]"/>
                  </div>
                </div>
              </div>
            </li>

          </ul>
        </div>

        <!-- Submit button -->
        <div class="content-block">
          <input type="submit" value="Create my Reel" class="button button-fill button-big color-orange">
        </div>
      </form>
    </div>
  </div>
</div>
