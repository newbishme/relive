/**
 * Framework7 3D Panels 1.0.0
 * Framework7 plugin to add 3d effect for side panels
 *
 * http://www.idangero.us/framework7/plugins/
 *
 * Copyright 2015, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 *
 * Released on: August 22, 2015
 */
Framework7.prototype.plugins.panels3d = function (app, params) {
'use strict';
    params = params || {enabled: true};
var $ = window.Dom7;
    app.panels3d = {
enable: function () {
            $('body').addClass('panels-3d');
            params.enabled = true;
        },
disable: function () {
            $('body').removeClass('panels-3d');
            params.enabled = false;
        },
    };
if (params.enabled) $('body').addClass('panels-3d');
var leftPanelWidth, rightPanelWidth, leftPanel, rightPanel, views;
function leftPanelOpen() {
if (!params.enabled) return;
        views.css({
'-webkit-transform-origin': '100% center',
'transform-origin': '100% center',
        });
    }
function rightPanelOpen() {
if (!params.enabled) return;
        views.css({
'-webkit-transform-origin': '0% center',
'transform-origin': '0% center',
        });
    }
function appInit() {
        views = $('.views');
        leftPanel = $('.panel-left.panel-reveal');
        rightPanel = $('.panel-right.panel-reveal');
        leftPanel.on('open', leftPanelOpen);
        rightPanel.on('open', rightPanelOpen);
    }
function setPanelTransform(viewsContainer, panel, perc) {
if (!params.enabled) return;
        panel = $(panel);
if (!panel.hasClass('panel-reveal')) return;
if (panel.hasClass('panel-left')) {
if (!leftPanelWidth) leftPanelWidth = panel[0].offsetWidth;
            views.transform('translate3d(' + (leftPanelWidth * perc) + 'px,0,0) rotateY(' + (-30 * perc) + 'deg)');
            views.css({
'-webkit-transform-origin': '100% center',
'transform-origin': '100% center',
            });
            panel.transform('translate3d(' + (-leftPanelWidth * (1 - perc)) + 'px,0,0)');
        }
if (panel.hasClass('panel-right')) {
if (!rightPanelWidth) rightPanelWidth = panel[0].offsetWidth;
            views.transform('translate3d(' + (-rightPanelWidth * perc) + 'px,0,0) rotateY(' + (30 * perc) + 'deg)');
            views.css({
'-webkit-transform-origin': '0% center',
'transform-origin': '0% center',
            });
            panel.transform('translate3d(' + (rightPanelWidth * (1 - perc)) + 'px,0,0)');
        }
    }
return {
        hooks : {
            appInit: appInit,
            swipePanelSetTransform: setPanelTransform,
        }
    };
};

/*jslint browser: true*/
/*global console, Framework7, alert, Dom7*/

/**
 * A plugin for Framework7 to show black little toasts
 *
 * @author www.timo-ernst.net
 * @license MIT
 */
Framework7.prototype.plugins.toast = function (app, globalPluginParams) {
  'use strict';

  var Toast = function (text, iconhtml, options) {
    var self = this,
      $$ = Dom7,
      $box;

    function hideBox($curbox) {
      if ($curbox) {
        $curbox.removeClass('fadein').transitionEnd(function () {
          $curbox.remove();
        });
      }
    }

    this.show = function (show) {
      if (show) {
        var clientLeft,
          $curbox;

        // Remove old toasts first if there are still any
        $$('.toast-container').off('click').off('transitionEnd').remove();
        $box = $$('<div class="toast-container show">');

        // Add content
        $box.html('<div class="toast-icon">' + iconhtml + '</div><div class="toast-msg">' + text + '</div>');

        // Add to DOM
        clientLeft = $box[0].clientLeft;
        $$('body').append($box);

        // Hide box on click
        $box.click(function () {
          hideBox($box);
        });

        // Dirty hack to cause relayout xD
        clientLeft = $box[0].clientLeft;

        // Fade in toast
        $box.addClass('fadein');

        // Automatically hide box after few seconds
        $curbox = $box;
        setTimeout(function () {
          hideBox($curbox);
        }, 1500);

      } else {
        hideBox($$('.toast-container'));
      }
    };

    return this;
  };

  app.toast = function (text, iconhtml, options) {
    return new Toast(text, iconhtml, options);
  };

};

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

function isInArray(array, value) {
  return array.indexOf(value) > -1;
}

function removeFromArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
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
}

function loadJsonFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function storeImgToLocalStorage(key, imgData) {
  if (key == null || loadImgFromLocalStorage(key) != null) {
    return;
  }

  convertImgToBase64URL(imgData, function(base64Img, url) {
    localStorage.setItem(url, base64Img);
  });
}

function loadImgFromLocalStorage(key) {
  return localStorage.getItem(key);
}

function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
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

// Keys for localStorage/SessionStorage lookup
var reliveFavouritesKey = 'Relive-Favourite-Events-and-Posts-Key';

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

myApp.onPageInit('landing', function(page) {
  sendToGoogleAnalytics('index.php', page.name);
  $$('.navbar').addClass('hidden');
  $$('#landing-searchbar-input').focus();
  $$('.landing-searchbar').on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var searchText = e.srcElement[0].value;
    var options = {
      url: 'events.php',
      query: { q: searchText }
    };
    mainView.router.load(options);
    return false;
  });
});

myApp.onPageReinit('events', function (page) {
  eventsInit(page);
});

// Callbacks to run specific code for specific pages, for example for events data page:
myApp.onPageInit('events', function (page) {
  eventsInit(page);
});

function eventsInit(page) {
  sendToGoogleAnalytics('events.php', page.name);
  $$('.navbar').removeClass('hidden');

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
        '<a href="event/{{event_id}}" class="link event-page-url" relive-event-id="{{event_id}}">' +
          '<div style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({{image}})" class="event-card-header-img">' +
            '<h1>{{eventName}}</h1>' +
          '</div>' +
          '<div class="event-card-footer">' +
            '<a href="event/{{event_id}}" class="link right event-page-url" relive-event-id="{{event_id}}">View Event<i class="icon ion-ios-arrow-forward"></i></a>' +
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
      },
      onItemsAfterInsert: function (list, fragment) {
        // Allow offline a href clicks to still load the linked page
        $$('a.event-page-url').on('click', function (e) {
          e.preventDefault();
          var eventId = $$(this).attr('relive-event-id')
          console.log(eventId);
          var query = {
            id: eventId
          };
          var options = {
              url: 'event.php?id='+eventId,
              query: query,
              pushState: true
          };
          myApp.closePanel();
          mainView.router.load(options);
          return false;
        });
      }
  });

  // Initialize Search bar
  myApp.searchbar('.searchbar', {
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
          updateEventsList(data);
        }
      } // End ajax success
    }); // End ajax
  } else {
    var data = loadJsonFromLocalStorage(eventIndexesKey);
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

  var hashtags = [];
  var filteredHashtags = [];
  var posts = [];
  var eventPostsList;
  var loading = false;
  var lastLoadedIndex = 0;
  var timeout = 3000;
  var eventNameKey = 'Relive-Event-ID-' + pageId;
  var eventHashtagsTemplate = $$('#sideNavEventHashtagsTemplate').html();
  var compiledEventHashtagsTemplate = Template7.compile(eventHashtagsTemplate);
  var toast = myApp.toast('Saved', '<div>☆</div>', {})

  if (page.query.id != null) {
    var pageId = page.query.id;
    var eventName = 'Event';

    $$.ajax({
      type:'GET',
      url:'https://relive.space/api/event/'+pageId,
      dataType:'json',
      success:function(data) {
        if (data.eventName != null) {
          eventName = data.eventName;
        }
        if (data.hashtags != null) {
          hashtags = data.hashtags;
        }
        $$('.title-event-name').html(decodeURI(eventName));
        updateHashtagsList(hashtags);
      } // End Success
    }); // End ajax to get event information

    // Initialize Side Nav Filter Hashtags
    function updateHashtagsList(hashtags) {
      var eventHashtags = [];
      var eventHashtagHtml = '';

      if (hashtags == null) {
        return;
      }

      eventHashtags = hashtags;

      for (var i = 0; i < eventHashtags.length; i++) {
        var hashtag = {hashtag: eventHashtags[i]};
        eventHashtagHtml = eventHashtagHtml.concat(compiledEventHashtagsTemplate(hashtag));
      }
      $$('div#side-nav-event-hashtags').html(eventHashtagHtml);
      $$('.relive-filter-hashtag').on('click', function(e) {
        if ($$(this) != null && $$(this)[0] != null) {
          var checked = $$(this)[0].checked;
          var hashtag = $$(this)[0].value;
          if (!checked && !isInArray(filteredHashtags, hashtag)) {
            filteredHashtags.push(hashtag);
            updateEventPosts(posts);
          } else if (checked && isInArray(filteredHashtags, hashtag)) {
            removeFromArray(filteredHashtags, hashtag);
            updateEventPosts(posts);
          }
        }
      });
    }

    function updateEventPosts(eventPostsData) {
      var filteredPosts = [];

      if (eventPostsData != null) {
        eventPostsData.forEach(function(post){
          var hiddenPostIdKey = "relive-hidden-post-id-" + post.post_id;
          var postTime = moment.unix(post.datetime);
          post.datetime = postTime.fromNow();
          if (!isPostHiddenInLocalStorage(hiddenPostIdKey)) {
            posts.push(post);
          }
        });
        lastLoadedIndex += eventPostsData.length; // Count all included hidden items
      }

      if (filteredHashtags.length > 0) {
        for (var i = 0; i < posts.length; i++) {
          var currPost = posts[i];
          var isMatch = false;
          for (var j = 0; j < filteredHashtags.length; j++) {
            for (var k = 0; k < currPost.hashtags.length; k++) {
              if (currPost.hashtags[k].toUpperCase() === filteredHashtags[j].toUpperCase()) {
                console.log("Filter: "+filteredHashtags[j].toUpperCase());
                console.log("Current post hashtag: " + currPost.hashtags[k].toUpperCase());
                isMatch = true;
                break;
              }
            }
          }
          if (!isMatch) {
            filteredPosts.push(currPost);
          }
        }
      } else {
        filteredPosts = posts;
      }

      eventPostsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
          items: filteredPosts,
          template:

          '<li class="{{#if media}}image{{else}}text{{/if}} post swipeout" relive-post-id="{{post_id}}">' +
            '<div class="swipeout-content">' +
              '{{#if media}}' +
              '<div style="background-image: url({{media.data.0.mediaURL}})" class="post-img relive-photobrowser-lazy" relive-mediabrowser-url="{{media.data.0.mediaURL}}" relive-mediabrowser-caption="{{caption}}"></div>' +
              '{{/if}}' +
              '<div class="post-data-origin-wrapper">' +
                '<div class="post-data">' +
                  '<div class="post-author">{{author}}<span class="post-time">{{datetime}}</span></div>' +
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
            '<div class="swipeout-actions-left">' +
              '<a href="#" class="bg-green swipeout-close swipeToSaveFavourites" relive-post-id="{{post_id}}" relive-post-content="{{caption}}" relive-post-author="{{author}}" relive-post-provider="{{providerName}}" {{#if media}}relive-favourite-post-img-url="{{media.data.0.mediaURL}}"{{/if}}>Save to Favourites</a>' +
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

            $$('.swipeToSaveFavourites').on('click', function () {
              var postId = $$(this).attr('relive-post-id');
              var author = $$(this).attr('relive-post-author');
              var caption = $$(this).attr('relive-post-content');
              var provider = $$(this).attr('relive-post-provider');
              var mediaURL = $$(this).attr('relive-favourite-post-img-url');
              var favourites = loadJsonFromLocalStorage(reliveFavouritesKey);
              var favourite = {post_id: postId, author: author, caption: caption, providerName: provider, media: mediaURL};

              if (favourites == null) {
                favourites = [];
              }

              if (mediaURL != null) {
                storeImgToLocalStorage(mediaURL, mediaURL);
              }
              toast.show(true);
              favourites.push(favourite);
              storeJsonToLocalStorage(reliveFavouritesKey, favourites);
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

myApp.onPageInit('favourites', function (page) {
  sendToGoogleAnalytics(page.url, 'Relive | Favourites');

  var posts = [];
  var favouritePostsList;
  var loading = false;

  function reloadFavouritePosts(favouritePostsData) {
    if (favouritePostsData != null) {
      posts = [];
      favouritePostsData.forEach(function(post){
        // FIXME not optimized, this loads every favourite posts.
        if (post.image != "") {
          var loadedBase64Img = loadImgFromLocalStorage(post.image);
          if (loadedBase64Img != null) {
            post.image = loadedBase64Img;
          } else {
            storeImgToLocalStorage(post.image, post.image); // Fallback in case image wasn't loaded before
          }
        }
        posts.push(post);
      });
      $$('.relive-no-favourites-found').addClass('hidden');
      $$('.relive-favourites-found').removeClass('hidden');
    } else {
      $$('.relive-no-favourites-found').removeClass('hidden');
      $$('.relive-favourites-found').addClass('hidden');
    }

    favouritePostsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
        items: posts,
        template:

        '<li class="{{#if media}}image{{else}}text{{/if}} post swipeout" relive-post-id="{{post_id}}">' +
          '<div class="swipeout-content">' +
            '{{#if media}}' +
            '<div style="background-image: url({{media}})" class="post-img relive-photobrowser-lazy" relive-mediabrowser-url="{{media}}" relive-mediabrowser-caption="{{caption}}"></div>' +
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
            '<a href="#" id="swipeToHideURL" class="swipeout-delete swipeout-overswipe">Remove from Favourites</a>' +
          '</div>' +
        '</li>',


        height: function (post) {
          if (post.media) return 500;
          else return 200;
        },
        onItemsAfterInsert: function (list, fragment) {
          $$('.swipeout').on('deleted', function () {
            var relivePostId = $$(this).attr('relive-post-id');
            var newPostsAfterDelete = [];
            for (var i = 0; i < posts.length; i++) {
              if (posts[i].post_id !== relivePostId) {
                newPostsAfterDelete.push(posts[i]);
              } else {
                if (posts[i].media != null) {
                  removeItemFromLocalStorage(posts[i].media);
                }
              }
            }
            posts = newPostsAfterDelete;
            storeJsonToLocalStorage(reliveFavouritesKey, posts);
          });
        }
    }); // End virtualList initialization
  }

  var favouritePostsData = loadJsonFromLocalStorage(reliveFavouritesKey);
  reloadFavouritePosts(favouritePostsData);
});

// Hides and Shows filter hashtag list when appropriate
myApp.onPageAfterAnimation('landing', function (page) {
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').addClass('hidden');
});
myApp.onPageAfterAnimation('home', function (page) {
  $$('div.event-hashtags-block').addClass('hidden');
});
myApp.onPageAfterAnimation('event', function (page) {
  $$('div.event-hashtags-block').removeClass('hidden');
  $$('.navbar').removeClass('hidden');
});
myApp.onPageAfterAnimation('events', function (page) {
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').removeClass('hidden');
  var mySearchbar = $$('.searchbar')[0].f7Searchbar;

  // Search if there's a query
  if (page.query.q != null) {
    mySearchbar.search(page.query.q);
  }
});
myApp.onPageAfterAnimation('favourites', function (page) {
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').removeClass('hidden');
});
myApp.onPageAfterAnimation('form', function (page) {
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').removeClass('hidden');
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
      setTimeout(function () {
        myApp.hideIndicator();
      }, 3000);
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
      url: 'event.php?id='+query.id,
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
