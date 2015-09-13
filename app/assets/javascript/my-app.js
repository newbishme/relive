// Export selectors engine
var $$ = Dom7;

$$('head').append(
    '<link rel="stylesheet" href="assets/stylesheets/framework7.ios.min.css">' +
    '<link rel="stylesheet" href="assets/stylesheets/framework7.ios.colors.min.css">' +
    '<link rel="stylesheet" href="assets/stylesheets/my-app.ios.css">' +
    '<link rel="stylesheet" href="assets/stylesheets/relive.min.css">'
);

// Change "Through" type navbar layout to "Fixed" in Material theme for Android
// if (isAndroid) {
//     // Change class
//     $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
//     // And move Navbar into Page
//     $$('.view .navbar').prependTo('.view .page');
// }

// Initialize your app
var myApp = new Framework7({
    init: false,
    template7Pages: true, //enable Template7 rendering for pages
    // material: isAndroid ? true : false,
    dynamicNavbar: false,
    domCache: true,
    uniqueHistory: true,
    preloadPreviousPage: true
});

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

// Callbacks to run specific code for specific pages, for example for Home data page:
myApp.onPageInit('home', function (page) {
  // TODO Get events from local cache, if not found, get from server
  var events = [];
  var lastEventId = 0;

  // Initialize Virtual List
  var eventsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
      items: events,
      template:
      // event card template
      '<li class="event-card">' +
        '<div style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({{image}})" class="event-card-header-img">' +
          '<h1>{{title}}</h1>' +
        '</div>' +
        '<div class="event-card-footer">' +
          '<a href="event.php?id={{id}}" class="link right">View Event<i class="icon ion-ios-arrow-forward"></i></a>' +
        '</div>' +
      '</li>',

      height: 212,
      searchAll: function (query, items) {
        var foundItems = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ) {
            foundItems.push(i);
          }
        }
        return foundItems;
      }
  });

  // Initialize Search bar
  var eventsSearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.card-header'
  });

  // Load more events if connected to internet
  $$.ajax({
    type:'GET',
    url:'landing-page-test-endpoint.php',
    data:{"lastEventId":lastEventId},
    dataType:'json',
    success:function(data){
      if (data !== '') {
        eventsList.appendItems(data);
        eventsList.update();
        lastEventId += data.length;
      }
    } // End ajax success
  }); // End ajax


  // Initialize Side Nav Recent events
  var recentEventTemplate = $$('#sideNavRecentEventTemplate').html();
  var compiledRecentEventTemplate = Template7.compile(recentEventTemplate);
  var recentEvents = [];
  var recentHtml = '';

  $$.ajax({
    type:'GET',
    url:'recent-events-test-endpoint.php',
    dataType:'json',
    success:function(data){
      if (data !== '') {
        recentEvents = data;
        for (var i = 0; i < recentEvents.length; i++) {
          recentHtml = recentHtml.concat(compiledRecentEventTemplate(recentEvents[i]));
        }
        $$('div#side-nav-recent-events').html(recentHtml);
      }
    } // End ajax success
  }); // End ajax


  // Initialize Side Nav Recent events
  var trendingEventTemplate = $$('#sideNavTrendingEventTemplate').html();
  var compiledTrendingEventTemplate = Template7.compile(trendingEventTemplate);
  var trendingEvents = [];
  var trendingHtml = '';

  $$.ajax({
    type:'GET',
    url:'recent-events-test-endpoint.php',
    dataType:'json',
    success:function(data){
      if (data !== '') {
        trendingEvents = data;
        for (var i = 0; i < trendingEvents.length; i++) {
          trendingHtml = trendingHtml.concat(compiledTrendingEventTemplate(trendingEvents[i]));
        }
        $$('div#side-nav-trending-events').html(trendingHtml);
      }
    } // End ajax success
  }); // End ajax


  // Initialize Pull to refresh
  var ptrContent = $$('.pull-to-refresh-content');

  ptrContent.on('refresh', function (e) {
    setTimeout(function () {
      // Load more events if connected to internet
      $$.ajax({
        type:'GET',
        url:'landing-page-test-endpoint.php',
        data:{"lastEventId":lastEventId},
        dataType:'json',
        success:function(data){
          if (data !== '') {
            eventsList.appendItems(data);
            eventsList.update();
            lastEventId += data.length;
          }
          myApp.pullToRefreshDone();
        } // End ajax success
      }); // End ajax
    }, 2000);
  });

});

myApp.onPageInit('event', function (page) {
  // TODO Get events from local cache, if not found, get from server
  var posts = [];
  var eventPostsList;
  var loading = false;
  var lastLoadedIndex = 0;

  if (page.query.id != null) {
    var pageId = page.query.id;

    $$.ajax({
      type:'GET',
      url:'infinite-scroll-test.php?id='+pageId,
      data:{"lastRec":lastLoadedIndex+1},
      dataType:'json',
      success:function(data) {
        posts = data;
        lastLoadedIndex += posts.length;
        eventPostsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
            items: posts,
            template:

            '<li class="{{#if image}}image{{else}}text{{/if}} post">' +
              '{{#if image}}' +
              '<div style="background-image: url({{image}})" class="post-img"></div>' +
              '{{/if}}' +
              '<div class="post-data-origin-wrapper">' +
                '<div class="post-data">' +
                  '<div class="post-author">{{author}}</div>' +
                  '{{#if image}}' +
                  '<div class="post-content">{{content}}</div>' +
                  '{{else}}' +
                  '<blockquote class="post-content">{{content}}</blockquote>' +
                  '{{/if}}' +
                '</div>' +
                '<div class="post-origin">' +
                  '<i class="icon ion-social-instagram-outline"></i>' +
                '</div>' +
              '</div>' +
            '</li>',


            height: function (post) {
              if (post.image) return 500;
              else return 200;
            },
            searchAll: function (query, items) {
              var foundItems = [];
              for (var i = 0; i < items.length; i++) {
                if (items[i].title.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ) {
                  foundItems.push(i);
                }
              }
              return foundItems;
            }
        }); // End virtualList initialization
      } // End Success
    }); // End AJAX

    setTimeout(function() {
      loading = false;

      $$('.infinite-scroll').on('infinite', function() {
        if (loading) return;
        loading = true;
        $$.ajax({
          type:'GET',
          url:'infinite-scroll-test.php?id='+pageId,
          data:{"lastRec":lastLoadedIndex+1},
          dataType:'json',
          success:function(data){
            loading = false;
            if (data === '') {
              //  Nothing to load, detach infinite scroll events
              myApp.detachInfiniteScroll(".infinite-scroll");
            } else {
              eventPostsList.appendItems(data);
              eventPostsList.update();
              lastLoadedIndex += data.length-1;
            }
          }
        }); // End AJAX
      }); // End infinite scroll
    }, 3000);
  }
});


// Handle form ajax actions
$$(document).on('submitted', 'form.ajax-submit', function (e) {
  var xhr = e.detail.xhr;
  var data = e.detail.data;
  // Clear form, hide panel
  console.log('form successfully submitted');
  console.log(data);
  mainView.router.back();
});

$$(document).on('beforeSubmit', 'form.ajax-submit', function (e) {
  var xhr = e.detail.xhr;
  var data = e.detail.data;
  // Clear form, hide panel
  console.log('beforeSubmit callback');
  console.log(data);
});

$$(document).on('submitError', 'form.ajax-submit', function (e) {
  var xhr = e.detail.xhr;
  var data = e.detail.data;
  console.log('Error on submit!!!!');
  console.log(xhr);
});

// Initialize the app
myApp.init();
