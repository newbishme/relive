// Export selectors engine
var $$ = Dom7;

$$('head').append(
    '<link rel="stylesheet" href="assets/stylesheets/ionicons.min.css">' +
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
    preloadPreviousPage: true,
    pushState: true
});

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
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
          '<h1>{{eventName}}</h1>' +
        '</div>' +
        '<div class="event-card-footer">' +
          '<a href="event.php?id={{event_id}}&name={{eventName}}" class="link right">View Event<i class="icon ion-ios-arrow-forward"></i></a>' +
        '</div>' +
      '</li>',

      height: 212,
      searchAll: function (query, items) {
        var foundItems = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].eventName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ) {
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
    url:'https://relive.space/api/event/indexes',
    data:{"startAt":lastEventId},
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
    url:'https://relive.space/api/event/recent',
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
    url:'https://relive.space/api/event/trending',
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
        url:'https://relive.space/api/event/indexes',
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
    var eventName = 'Event';

    if (page.query.name != null) {
      eventName = page.query.name;
    }

    $$('.title-event-name').text(eventName);

    $$.ajax({
      type:'GET',
      url:'https://relive.space/api/event/'+pageId+'/post',
      data:{"startAt":lastLoadedIndex},
      dataType:'json',
      success:function(data) {
        posts = data;
        lastLoadedIndex += posts.length;
        eventPostsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
            items: posts,
            template:

            '<li class="{{#if media}}image{{else}}text{{/if}} post">' +
              '{{#if media}}' +
              '<div style="background-image: url({{media.data.0.mediaURL}})" class="post-img"></div>' +
              '{{/if}}' +
              '<div class="post-data-origin-wrapper">' +
                '<div class="post-data">' +
                  '<div class="post-author">{{author}}</div>' +
                  '{{#if image}}' +
                  '<div class="post-content">{{caption}}</div>' +
                  '{{else}}' +
                  '<blockquote class="post-content">{{caption}}</blockquote>' +
                  '{{/if}}' +
                '</div>' +
                '<div class="post-origin">' +
                  '{{#if provider_id}}' +
                  '<i class="icon ion-social-instagram-outline"></i>' +
                  '{{else}}' +
                  '<i class="icon ion-social-twitter-outline"></i>' +
                  '{{/if}}' +
                '</div>' +
              '</div>' +
            '</li>',


            height: function (post) {
              if (post.media) return 500;
              else return 200;
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
          url:'https://relive.space/api/event/'+pageId+'/post',
          data:{"startAt":lastLoadedIndex},
          dataType:'json',
          success:function(data){
            loading = false;
            if (data === '') {
              //  Nothing to load, detach infinite scroll events
              myApp.detachInfiniteScroll(".infinite-scroll");
            } else {
              eventPostsList.appendItems(data);
              eventPostsList.update();
              lastLoadedIndex += data.length;
            }
          }
        }); // End AJAX
      }); // End infinite scroll
    }, 3000);
  }
});


// Initialize form page to have ajax indicator
myApp.onPageInit('form', function (e) {
  $$(document).on('ajaxStart', function (e) {
      myApp.showIndicator();
  });
  $$(document).on('ajaxComplete', function () {
      myApp.hideIndicator();
  });
});

myApp.onPageInit('form', function (page) {
  var hasNoName = false;
  var hasHashtagError = false;
  var maxHashtags = 5;
  var hashtags = [];
  var id = 1;

  $$('.event-name-input').on('focusout', function(e) {
    if (e.srcElement.value.length === 0) {
      hasNoName = true;
      $$('#event-name-header').html("Please give your event a name").addClass("color-red");
      $$('#event-name-input-icon').addClass("color-red");
    }
  });

  $$('.event-name-input').on('keypress', function(e) {
    if (hasNoName) {
      if (e.srcElement.value.length > 0) {
        hasNoName = false;
        $$('#event-name-header').html("Event Name").removeClass("color-red");
        $$('#event-name-input-icon').removeClass("color-red");
      }
    }
  });

  $$('.hashtags-input').on('focusout', function(e) {
    if (hashtags.length === 0) {
      addHashtagError("Please add at least 1 hashtag");
    } else {
      removeHashtagError();
    }
  });

  function addHashtagError(errorMessage) {
    if (!hasHashtagError) {
      $$('#hashtags-header').html(errorMessage).addClass("color-red");
      $$('#hashtags-input-icon').addClass("color-red");
    }
  };

  function removeHashtagError() {
    hasHashtagError = false;
    updateHashtagTitle();
    $$('#hashtags-header').removeClass("color-red");
    $$('#hashtags-input-icon').removeClass("color-red");
  };

  function updateHashtagTitle() {
    var numHashtagsLeft = maxHashtags - hashtags.length;
    if (numHashtagsLeft > 1) {
      $$('#hashtags-header').html("You can add " + numHashtagsLeft + " more hashtags");
    } else if (numHashtagsLeft === 1) {
      $$('#hashtags-header').html("You can add " + numHashtagsLeft + " more hashtag");
    } else {
      $$('#hashtags-header').html("You're done!");
    }
  }

  $$('.hashtags-input').on('keypress', function(e) {
    if (e.keyCode === 32) { // spacebar
      var inputHashtagsArr = e.srcElement.value.split(" ");
      var returnHashtags = "";
      for (var i in inputHashtagsArr) {
        var hashtag = inputHashtagsArr[i].replace(/[^a-zA-Z 0-9]+/g, '');

        if (hashtag.length === 0) {
        } else if (contains(hashtags, hashtag)) {
          addHashtagError("You've added this hashtag before");
        } else if (hashtags.length === maxHashtags) {
          addHashtagError("You can only add 5 hashtags");
        } else {
          $$('.hashtags').removeClass('hidden');

          hashtags.push(hashtag);
          $$('.hashtags').append(
            '<div class="hashtag" id="ht' + id + '">#' +
              hashtag + '<i class="icon ion-close"></i>' +
            '</div>'
          );

          removeHashtagError();

          $$('#ht' + id).on('click', function(e) {
            var toBeDeleted = $$(this)[0].innerText.replace('#', '');
            hashtags.splice(hashtags.indexOf(toBeDeleted), 1);
            $$(this).remove();
            updateHashtagTitle();
            if (hashtags.length === 0) {
              $$('.hashtags').addClass('hidden');
              addHashtagError("Please add at least 1 hashtag");
            }
          });

          id++;
          continue;
        }

        returnHashtags += hashtag + " ";
      }
      $$(this).val(returnHashtags.trim());
    }

    function contains(array, str) {
      for (var i in array) {
        if (array[i].toLowerCase() === str.toLowerCase()) {
          return true;
        }
      }
      return false;
    }
  });
});

// Handle form ajax actions
$$(document).on('submitted', 'form.ajax-submit', function (e) {
  // Clear form, hide panel
  var eventDetails = JSON.parse(e.detail.data);
  var query = {
    id: eventDetails.event_id,
    name: eventDetails.eventName
  };
  var options = {
      url: 'event.php',
      query: query,
      pushState: true
  };
  mainView.router.load(options);
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
  myApp.addNotification({
        title: 'Unsuccessful submission',
        message: 'There was a problem sending your request to the server.'
  });
});

// Initialize the app
myApp.init();
