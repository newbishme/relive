function sendToGoogleAnalytics(page, title) {
  if (page == null) {
    return;
  }

  var pageTitle = 'Relive';

  if (title != null) {
    pageTitle = title;
  }

  ga('send', 'pageview', {
    'page': page,
    'title': pageTitle
  });
}

function storeHiddenPostsToLocalStorage(key, hiddenPostId) {
  if (key == null) {
    return;
  }
  localStorage.setItem(key, hiddenPostId);
}

function isPostHiddenInLocalStorage(key) {
  return localStorage.getItem(key) != null;
}

function storeJsonToLocalStorage(key, jsonData) {
  if (key == null) {
    return;
  }
  var dataToStore = JSON.stringify(jsonData);
  localStorage.setItem(key, dataToStore);
  // console.log('=====STORE=====');
  // console.log('Storing: ');
  // console.log(localStorage.getItem(key));
  // console.log('===============');
}

function loadJsonFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function storeImgToSessionStorage(key, imgData) {
  if (key == null || loadImgFromSessionStorage(key) != null) {
    return;
  }

  convertImgToBase64URL(imgData, function(base64Img, url) {
    sessionStorage.setItem(url, base64Img);
  });
}

function loadImgFromSessionStorage(key) {
  return sessionStorage.getItem(key);
}

function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL, img.src);
        canvas = null;
    };
    img.src = url;
}

// Export selectors engine
var $$ = Dom7;

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
    dynamicNavbar: true,
    domCache: true
});

myApp.onPageReinit('landing', function(page) {
  $$('.navbar').addClass('hidden');
});

myApp.onPageInit('landing', function(page) {
  console.log('landing');
  // var isLandingPageHidden = false;
  // $$('.page-content').on('scroll', function() {
  //   if (!isLandingPageHidden) {
  //      // && $$('.page-content')[0].scrollTop > $$('.landing-header')[0].clientHeight/6) {
  //     hideLandingPage();
  //     isLandingPageHidden = true;
  //     // $$('.page-content')[0].scrollTop = 0;
  //   }
  // });

  $$('.navbar').addClass('hidden');
  $$('.discover').on('click', function(e) {
    mainView.router.load({pageName: 'home'});
  });

  $$('.landing-searchbar').on('submit', function(e) {
    var searchText = e.srcElement[0].value;
    mainView.router.load({pageName: 'home'});
    search(searchText);
  });

  function hideLandingPage() {
    $$('.landing-header').addClass('visually-hidden');
    setTimeout(function() {
      $$('.landing-header').remove();
      $$('.searchbar-overlay').removeClass('hidden');
      $$('.pull-to-refresh-layer').removeClass('hidden');
    }, 1000);

    $$('.navbar').removeClass('hidden').addClass('visible');
    $$('.searchbar-disabled').addClass('searchbar').removeClass('searchbar-disabled');
  }

  function search(query) {
    $$('#search-input-box')[0].value = query;
  }
});

myApp.onPageReinit('home', function(page) {
  homeInit(page);
});
// Callbacks to run specific code for specific pages, for example for Home data page:
myApp.onPageInit('home', function (page) {
  homeInit(page);
});

function homeInit(page) {
  sendToGoogleAnalytics('/', page.name);

  // TODO Get events from local cache, if not found, get from server
  var events = [];
  var eventIndexesKey = 'eventIndexes';
  var lastEventId = 0;
  var runOnceKey = 'reliveRunOnceKey';

  // Initialize Virtual List
  var eventsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
      items: events,
      template:
      // event card template
      '<li class="event-card">' +
        '<a href="event.php?id={{event_id}}&name={{eventName}}" class="link" id="eventPageURL">' +
          '<div style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({{image}})" class="event-card-header-img">' +
            '<h1>{{eventName}}</h1>' +
          '</div>' +
          '<div class="event-card-footer">' +
            '<a href="event.php?id={{event_id}}&name={{eventName}}" class="link right" id="eventPageURL">View Event<i class="icon ion-ios-arrow-forward"></i></a>' +
          '</div>' +
        '</a>' +
      '</li>',

      height: 212,
      searchAll: function (query, items) {
        var foundItems = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].eventName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ) {
            foundItems.push(i);
          }
        }
        if (foundItems.length > 0) {
          $$('.landing-what-is-relive').addClass('searchbar-not-found');
        }
        return foundItems;
      }
  });

  $$('.navbar').removeClass('hidden');

  var isLandingPageHidden = false;
  $$('.page-content').on('scroll', function() {
    if (!isLandingPageHidden) {
       // && $$('.page-content')[0].scrollTop > $$('.landing-header')[0].clientHeight/6) {
      hideLandingPage();
      isLandingPageHidden = true;
      // $$('.page-content')[0].scrollTop = 0;
    }
  });

  $$(".discover").on('click', function(e) {
    hideLandingPage();
  });

  $$('.landing-searchbar').on('submit', function(e) {
    var searchText = e.srcElement[0].value;
    hideLandingPage();
    search(searchText);
  });

  function hideLandingPage() {
    $$('.landing-header').addClass('visually-hidden');
    setTimeout(function() {
      $$('.landing-header').remove();
      $$('.searchbar-overlay').removeClass('hidden');
      $$('.pull-to-refresh-layer').removeClass('hidden');
    }, 1000);

    $$('.navbar').removeClass('hidden').addClass('visible');
    $$('.searchbar-disabled').addClass('searchbar').removeClass('searchbar-disabled');
  }

  function search(query) {
    $$('#search-input-box')[0].value = query;
  }

  // Initialize Search bar
  var eventsSearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.card-header'
  });

  // Splits a given URL by its parameters if any (eg. ?id=1&name=ABC)
  function URLToArray(url) {
    var request = {};
    var pairs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < pairs.length; i++) {
      if (!pairs[i]) continue;
      var pair = pairs[i].split('=');
      request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return request;
  }

  function updateEventsList(eventsData) {
    eventsList.appendItems(eventsData);
    eventsList.update();
    lastEventId += eventsData.length;

    // Allow offline a href clicks to still load the linked page
    $$('a#eventPageURL').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var eventHref = $$(this).attr('href');
      var eventHrefArray = URLToArray(eventHref);
      var query = {
        id: eventHrefArray['id'],
        name: eventHrefArray['name']
      };
      var options = {
          url: 'event.php',
          query: query,
          pushState: true
      };
      mainView.router.load(options);
      return false;
    });
  }

  if (navigator.onLine) {
    // Load more events if connected to internet
    $$.ajax({
      type:'GET',
      url:'https://relive.space/api/event/indexes',
      data:{"startAt":lastEventId},
      dataType:'json',
      success:function(data){
        if (data !== '') {
          storeJsonToLocalStorage(eventIndexesKey, data);
          sessionStorage.clear();
          for (var i = 0; i < data.length; i++) {
            if (data[i].image != "") {
              storeImgToSessionStorage(data[i].image, data[i].image);
            }
          }
          updateEventsList(data);
        }
      } // End ajax success
    }); // End ajax
  } else {
    var data = loadJsonFromLocalStorage(eventIndexesKey);
    for (var i = 0; i < data.length; i++) {
      if (data[i].image != "") {
        data[i].image = loadImgFromSessionStorage(data[i].image);
      }
    }
    updateEventsList(data);
  }



  // Initialize Side Nav Trending events
  var trendingEventTemplate = $$('#sideNavTrendingEventTemplate').html();
  var compiledTrendingEventTemplate = Template7.compile(trendingEventTemplate);
  var trendingEventsKey = 'trendingEventsIndexes';

  function updateTrendingList(events) {
    var trendingEvents = [];
    var trendingHtml = '';

    if (events == null) {
      return;
    }

    trendingEvents = events;

    for (var i = 0; i < trendingEvents.length; i++) {
      trendingHtml = trendingHtml.concat(compiledTrendingEventTemplate(trendingEvents[i]));
    }
    $$('div#side-nav-trending-events').html(trendingHtml);
  }

  if (navigator.onLine) {
    $$.ajax({
      type:'GET',
      url:'https://relive.space/api/event/trending',
      dataType:'json',
      success:function(data){
        if (data !== '') {
          storeJsonToLocalStorage(trendingEventsKey, data);
          updateTrendingList(data);
        }
      } // End ajax success
    }); // End ajax
  } else {
      var data = loadJsonFromLocalStorage(trendingEventsKey);
      updateTrendingList(data);
  }

  // Initialize Pull to refresh
  var ptrContent = $$('.pull-to-refresh-content');

  ptrContent.on('refresh', function (e) {
    setTimeout(function () {
      // Load more events if connected to internet
      if (navigator.onLine) {
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
            myApp.pullToRefreshDone();
          } // End ajax success
        }); // End ajax
      }
    }, 1000);
  });

}

myApp.onPageInit('event', function (page) {
  sendToGoogleAnalytics(page.url, 'Relive | ' + page.query.name);

  var posts = [];
  var eventPostsList;
  var loading = false;
  var lastLoadedIndex = 0;
  var timeout = 3000;

  if (page.query.id != null) {
    var pageId = page.query.id;
    var eventName = 'Event';

    if (page.query.name != null) {
      eventName = page.query.name;
    }

    var eventNameKey = 'ReliveEvent' + eventName;
    $$('.title-event-name').html(decodeURI(eventName));

    function updateEventPosts(eventPostsData) {
      if (eventPostsData != null) {
        eventPostsData.forEach(function(post){
          var hiddenPostIdKey = "relive-hidden-post-id-" + post.post_id;
          if (!isPostHiddenInLocalStorage(hiddenPostIdKey)) {
            posts.push(post);
          }
        });
        lastLoadedIndex += eventPostsData.length; // Count all included hidden items
      }

      eventPostsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
          items: posts,
          template:

          '<li class="{{#if media}}image{{else}}text{{/if}} post swipeout" relive-post-id="{{post_id}}">' +
            '<div class="swipeout-content">' +
              '{{#if media}}' +
              '<div style="background-image: url({{media.data.0.mediaURL}})" class="post-img relive-photobrowser-lazy" relive-mediabrowser-url="{{media.data.0.mediaURL}}" relive-mediabrowser-caption="{{caption}}"></div>' +
              '{{/if}}' +
              '<div class="post-data-origin-wrapper">' +
                '<div class="post-data">' +
                  '<div class="post-author">{{author}}</div>' +
                  '{{#if media}}' +
                  '<div class="post-content">{{caption}}</div>' +
                  '{{else}}' +
                  '<blockquote class="post-content">{{caption}}</blockquote>' +
                  '{{/if}}' +
                '</div>' +
                '<div class="post-origin">' +
                  '{{#if providerName}}' +
                  '<i class="icon ion-social-{{providerName}}-outline"></i>' +
                  '{{else}}' +
                  '<i class="icon ion-social-twitter-outline"></i>' +
                  '{{/if}}' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="swipeout-actions-right">' +
              '<a href="#" id="swipeToHideURL" class="swipeout-delete swipeout-overswipe">Hide and Report Post</a>' +
            '</div>' +
          '</li>',


          height: function (post) {
            if (post.media) return 500;
            else return 200;
          },
          onItemsAfterInsert: function (list, fragment) {
            $$('.swipeout').on('deleted', function () {
              var relivePostId = $$(this).attr('relive-post-id');
              $$.ajax({
                type:'POST',
                url:'https://relive.space/api/event/'+pageId+'/report',
                data:{"post_id":relivePostId},
                dataType:'text',
                success:function(data) {
                } // End Success
              });
              var hiddenPostIdKey = "relive-hidden-post-id-" + relivePostId;
              storeHiddenPostsToLocalStorage(hiddenPostIdKey, relivePostId);
            });

            $$('.relive-photobrowser-lazy').on('click', function () {
                var mediaURL = $$(this).attr('relive-mediabrowser-url');
                var mediaCaption = $$(this).attr('relive-mediabrowser-caption');
                var mediaObjects = [{url: mediaURL, caption: mediaCaption}];

                // Initialize Media Browser
                var relivePhotoBrowser = myApp.photoBrowser({
                    photos: mediaObjects,
                    theme: 'dark',
                    navbar: false,
                    toolbar: false,
                    onTap: function (swiper, event) {
                      relivePhotoBrowser.close();
                    }
                });
                relivePhotoBrowser.open();
            });
          }
      }); // End virtualList initialization

      if (eventPostsData === null || eventPostsData.length <= 0) {
        if (navigator.onLine) {
          setTimeout(function() {
            getPostsWithAJAX();
          }, timeout);
          timeout *= 2;
        }
      }
    }

    function getPostsWithAJAX() {
      $$.ajax({
        type:'GET',
        url:'https://relive.space/api/event/'+pageId+'/post',
        data:{"startAt":lastLoadedIndex},
        dataType:'json',
        success:function(data) {
          storeJsonToLocalStorage(eventNameKey, data);
          updateEventPosts(data);
          if (data.length > 0) {
            timeout = 3000;
          }
        }, // End Success
        error:function() {
          updateEventPosts(null);
        }
      }); // End AJAX
    }

    if (navigator.onLine) {
      getPostsWithAJAX();
    } else {
      var eventPostsData = loadJsonFromLocalStorage(eventNameKey);
      updateEventPosts(eventPostsData);
    }

    setTimeout(function() {
      loading = false;

      $$('.infinite-scroll').on('infinite', function() {
        if (loading || !navigator.onLine) return;
        loading = true;
        $$.ajax({
          type:'GET',
          url:'https://relive.space/api/event/'+pageId+'/post',
          data:{"startAt":lastLoadedIndex},
          dataType:'json',
          timeout: 5000,
          success:function(data){
            loading = false;
            if (data === '') {
              //  Nothing to load, detach infinite scroll events
              myApp.detachInfiniteScroll(".infinite-scroll");
            } else {
              var morePosts = [];
              data.forEach(function(post){
                var hiddenPostIdKey = "relive-hidden-post-id-" + post.post_id;
                if (!isPostHiddenInLocalStorage(hiddenPostIdKey)) {
                  morePosts.push(post);
                }
              });
              eventPostsList.appendItems(morePosts);
              eventPostsList.update();
              lastLoadedIndex += data.length;
            }
          }
        }); // End AJAX
      }); // End infinite scroll
    }, 1000);
  }
});


// Initialize form page
myApp.onPageInit('form', function (page) {
  sendToGoogleAnalytics(page.url, "Relive | Reel Creation");

  var hasNoName = false;
  var hasHashtagError = false;
  var maxHashtags = 3;
  var hashtags = [];
  var id = 1;

  $$(document).on('ajaxStart', function () {
      myApp.showIndicator();
  });
  $$(document).on('ajaxComplete', function () {
      myApp.hideIndicator();
  });

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
    if (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 44) { // spacebar OR enter OR comma
      var inputHashtagsArr = e.srcElement.value.split(/,| /);
      var returnHashtags = "";
      for (var i in inputHashtagsArr) {
        var hashtag = inputHashtagsArr[i].replace(/[^a-zA-Z 0-9]+/g, '');

        if (hashtag.length === 0) {
        } else if (contains(hashtags, hashtag)) {
          addHashtagError("You've added this hashtag before");
        } else if (hashtags.length === maxHashtags) {
          addHashtagError("You can only add 3 hashtags");
        } else {
          $$('.hashtags').removeClass('hidden');

          hashtags.push(hashtag);
          $$('.hashtags').append(
            '<div class="hashtag" id="ht' + id + '">#' +
              hashtag + '<i class="icon ion-close"></i>' +
              '<input style="display:none;" value="' + hashtag + '" type="text" name="relive-hashtags[]"/>' +
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

  $$('.hashtags-input').on('keyup', function(e) {
    if (e.keyCode === 32 || e.keyCode === 188) { // spacebar OR comma
      $$('.hashtags-input').val('');
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
      pushState: false
  };
  mainView.router.load(options);
});

$$(document).on('beforeSubmit', 'form.ajax-submit', function (e) {
  var xhr = e.detail.xhr;
  var data = e.detail.data;
  sendToGoogleAnalytics('/api/event', 'Relive | Submitted a Reel');
});

$$(document).on('submitError', 'form.ajax-submit', function (e) {
  var xhr = e.detail.xhr;
  var data = e.detail.data;
  console.log('====== AJAX Submit Error ======');
  console.log(xhr);
  console.log(data);
  console.log('===============================');
  showUserNotification('Unsuccessful submission', 'There was a problem sending your request to the server.');
});

// Initialize the app
myApp.init();

function showUserNotification(title, message) {
  myApp.addNotification({
        title: title,
        message: message
  });
}

window.addEventListener('online', function (event) {
  showUserNotification('Connected to the Internet','All features are available.');
}, false);

window.addEventListener('offline', function (event) {
  showUserNotification('No internet connectivity','Some features and functionalities will be restricted.');
}, false);
