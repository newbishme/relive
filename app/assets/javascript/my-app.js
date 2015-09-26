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

function storeRunOnceValueToLocalStorage() {
  var reliveRunOnboardingOnceKey = 'Relive-Run-Onboarding-Once-Key';
  localStorage.setItem(reliveRunOnboardingOnceKey, true);
}

function loadRunOnceValueFromLocalStorage() {
  var reliveRunOnboardingOnceKey = 'Relive-Run-Onboarding-Once-Key';
  return localStorage.getItem(reliveRunOnboardingOnceKey);
}

function storeUserCreatedReelToLocalStorage(eventId, eventName) {
  if (eventId == null || eventName == null) {
    return;
  }
  var userCreatedReels = [];
  var pendingImageFilename = 'assets/img/pending-reel.png';
  var userCreatedReel = {event_id: eventId, eventName: eventName, image: pendingImageFilename};

  if (loadUserCreatedReelsFromLocalStorage()) {
    userCreatedReels = loadUserCreatedReelsFromLocalStorage();
  }

  userCreatedReels.push(userCreatedReel);
  storeUserCreatedReelsToLocalStorage(userCreatedReels);
}

function storeUserCreatedReelsToLocalStorage(reels) {
  var reliveUserCreatedReelsKey = 'Relive-User-Created-Reels-Key';
  localStorage.setItem(reliveUserCreatedReelsKey, JSON.stringify(reels));
}

function loadUserCreatedReelsFromLocalStorage() {
  var reliveUserCreatedReelsKey = 'Relive-User-Created-Reels-Key';
  var userCreatedReels = JSON.parse(localStorage.getItem(reliveUserCreatedReelsKey));
  return userCreatedReels;
}

function deleteUserCreatedReelFromLocalStorage(eventId) {
  var userCreatedReels = loadUserCreatedReelsFromLocalStorage();
  var notDeletedReels = [];

  if (userCreatedReels == null) {
    return;
  }

  for (var i = 0; i < userCreatedReels.length; i++) {
    if (userCreatedReels[i].event_id != eventId) {
      notDeletedReels.push(userCreatedReels[i]);
    }
  }

  storeUserCreatedReelsToLocalStorage(notDeletedReels);
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

// For modifying Twitter/Instagram/G+ URL Schema to iOS supported schemas
var isIOS = Framework7.prototype.device.ios === true;
var regexToGetLastField = new RegExp("/\/([^\/]*)$/");

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

var options = {
  'bgcolor': '#374F59',
  'fontcolor': 'white'
}

var welcomescreen_slides = [
  {
    id: 'onboarding1',
    picture: '<img src="assets/img/onboarding1.png">',
    text: 'For the best experience, add relive to your homescreen.'
  },
  {
    id: 'onboarding2',
    picture: '<img src="assets/img/onboarding2.png">',
    text: 'Discover events to relive.'
  },
  {
    id: 'onboarding3',
    picture: '<img src="assets/img/onboarding3.png">',
    text: 'Tap this menu icon to see trending events, create new reels and view your favourites.'
  },
  {
    id: 'onboarding4',
    picture: '<img src="assets/img/onboarding4.png">',
    text: 'Like what you see?<br>Swipe a post to the right to save it.'
  },
  {
    id: 'onboarding5',
    picture: '<img src="assets/img/onboarding5.png">',
    text: "Don't want to see a post ever again?<br>Swipe it to the left to hide it."
  },
  {
    id: 'onboarding6',
    picture: '<img src="assets/img/onboarding6.png">',
    text: 'View your favourite posts<br>even when offline<br><br><a id="onboarding-close-btn" href="#">Start using relive!</a>'
  }
];

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

myApp.onPageInit('landing', function(page) {
  sendToGoogleAnalytics('index.php', page.name);
  $$('.navbar').addClass('hidden');

  if (loadRunOnceValueFromLocalStorage() == null) {
    var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
    $$('#onboarding-close-btn').on('click', function () {
      storeRunOnceValueToLocalStorage();
      welcomescreen.close();
    });
    $$('.welcomescreen-closebtn').on('click', function () {
      storeRunOnceValueToLocalStorage();
    });
  } else if (!isIOS) {
    $$('#landing-searchbar-input').focus();
  }

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

  // Initialize Side Nav Trending events
  var trendingEventTemplate = $$('#sideNavTrendingEventTemplate').html();
  var compiledTrendingEventTemplate = Template7.compile(trendingEventTemplate);
  var trendingEventsKey = 'trendingEventsIndexes';
  var timeout = 2000;

  function updateTrendingList(events) {
    if (events == null) {
      setTimeout(function() {
        getTrendingListWithAJAX();
      }, timeout);
      return;
    }

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

  function getTrendingListWithAJAX() {
    $$.ajax({
      type:'GET',
      url:'https://relive.space/api/event/trending',
      dataType:'json',
      success:function(data){
        if (data !== '') {
          storeJsonToLocalStorage(trendingEventsKey, data);
          updateTrendingList(data);
          timeout = 2000;
        }
      }, // End ajax success
      error:function(data){
        updateTrendingList(null);
      }
    }); // End ajax
  }

  if (navigator.onLine) {
    getTrendingListWithAJAX();
  } else {
    var data = loadJsonFromLocalStorage(trendingEventsKey);
    updateTrendingList(data);
  }
});

//  TODO remove this code after we confirm that it is not needed
// myApp.onPageReinit('events', function (page) {
//   eventsInit(page);
// });

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
  var timeout = 2000;

  if (loadUserCreatedReelsFromLocalStorage()) {
    events = loadUserCreatedReelsFromLocalStorage();

    for (var i = 0; i < events.length; i++) {
      if (events[i].event_id == null) {
        continue;
      }
      var userCreatedEventId = events[i].event_id;
      var ajaxURL = 'https://relive.space/api/event/' + userCreatedEventId;
      $$.ajax({
        type:'GET',
        url:ajaxURL,
        dataType:'json',
        success:function(data){
          if (data !== '') {
            if (data.event_id == userCreatedEventId) {
              deleteUserCreatedReelFromLocalStorage(userCreatedEventId);
            }
          }
        }, // End ajax success
        error:function(e){
          if (e.response == '["Status","Event not found."]') {
            deleteUserCreatedReelFromLocalStorage(userCreatedEventId);
          }
        }
      }); // End ajax
    }
  }

  // Initialize Virtual List
  var eventsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
      items: events,
      template:
      // event card template
      '<li class="event-card">' +
        '<a href="event/{{event_id}}" class="link event-page-url" relive-event-id="{{event_id}}" relive-event-name="{{eventName}}">' +
          '<div style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({{image}})" class="event-card-header-img">' +
            '<h1>{{eventName}}</h1>' +
          '</div>' +
          '<div class="event-card-footer">' +
            '<a href="event/{{event_id}}" class="link right event-page-url" relive-event-id="{{event_id}} relive-event-name="{{eventName}}"">View Event<i class="icon ion-ios-arrow-forward"></i></a>' +
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
        return foundItems;
      },
      onItemsAfterInsert: function (list, fragment) {
        // Allow offline a href clicks to still load the linked page
        $$('a.event-page-url').on('click', function (e) {
          e.preventDefault();
          var eventId = $$(this).attr('relive-event-id');
          var eventName = $$(this).attr('relive-event-name');
          var url = 'event.php?id='+eventId;
          if (!navigator.onLine) {
            url = 'event.php';
          }
          var query = {
            id: eventId,
            name: eventName
          };
          var options = {
              url: url,
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
  var reliveEventsSearchBar = myApp.searchbar('.relive-events-searchbar', {
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
    if (eventsData == null) {
      setTimeout(function (){
        getEventsListWithAJAX();
      }, timeout);
      timeout *= 2;
      return;
    }
    if (loadUserCreatedReelsFromLocalStorage()) {
      var loadedReels = loadUserCreatedReelsFromLocalStorage();
      var filteredPosts = [];

      for (var i = 0; i < eventsData.length; i++) {
        for (var j = 0; j < loadedReels.length; j++) {
          if (eventsData[i].event_id == loadedReels[j].event_id) {
            deleteUserCreatedReelFromLocalStorage(loadedReels[j].event_id);
          } else {
            filteredPosts.push(eventsData[i]);
          }
        }
      }
      if (filteredPosts.length > 0) {
        eventsData = filteredPosts;
      }
    }
    eventsList.appendItems(eventsData);
    eventsList.update();
    lastEventId += eventsData.length;
  }

  function getEventsListWithAJAX() {
    $$.ajax({
      type:'GET',
      url:'https://relive.space/api/event/indexes',
      data:{"startAt":lastEventId},
      dataType:'json',
      success:function(data){
        if (data !== '') {
          storeJsonToLocalStorage(eventIndexesKey, data);
          updateEventsList(data);
          timeout = 2000;
        }
      }, // End ajax success
      error:function(data){
        updateEventsList(null);
      }
    }); // End ajax
  }

  if (navigator.onLine) {
    // Load more events if connected to internet
    getEventsListWithAJAX();
  } else {
    var data = loadJsonFromLocalStorage(eventIndexesKey);
    updateEventsList(data);
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


// Methods for iOS users: replaces URL with the respective application URL Schemas
function modifyURLSchema(url, author) {
  var parsedURL = url;
  if (isIOS) {
    if (("standalone" in window.navigator) && window.navigator.standalone) {
      parsedURL = parseURLToSchema(parsedURL, author);
    }
  }
  return parsedURL;
}

function parseURLToSchema(url, author) {
  if (url == null || url.length < 4) {
    return;
  }

  if (url.substring(url.length-1) == "/") {
      url = url.substring(0, url.length-1);
  }

    var twitterRe = /twitter.*\/([^\/]*)$/;
    var instagramRe = /instagram.*\/([^\/]*)$/;
    var googleRe = /plus.google.*\/([^\/]*)$/;
    
    var twitterMatch = url.match(twitterRe);
    var instagramMatch = url.match(instagramRe);
    var googleMatch = url.match(googleRe);
    
    if (twitterMatch) {
        var parsedURL = "twitter://status?id="+twitterMatch[1];
        return parsedURL;
    } else if (instagramMatch) {
        var parsedURL = "instagram://user?username="+author; // FIXME: Should replace with media?id=MEDIA_ID
        return parsedURL;
    } else if (googleMatch) {
        var parsedURL = "gplus://"+googleMatch[0];
        return parsedURL;
    }
}


// Initialization for event page
myApp.onPageInit('event', function (page) {
  if (page.query.id == null) {
    var options = { url: 'events.php' };
    mainView.router.load(options);
    return;
  }

  var hashtags = [];
  var filteredHashtags = [];
  var posts = [];
  var eventPostsList;
  var loading = false;
  var lastLoadedIndex = 0;
  var timeout = 3000;
  var eventHashtagsTemplate = $$('#sideNavEventHashtagsTemplate').html();
  var compiledEventHashtagsTemplate = Template7.compile(eventHashtagsTemplate);
  var toast = myApp.toast('Saved', '<div>☆</div>', {});
  var pageId = page.query.id;
  var eventName = 'Event';
  var eventNameKey = 'Relive-Event-ID-' + pageId;

  if (page.query.name != null) {
    eventName = page.query.name;
    $$('.title-event-name').html(decodeURI(eventName));
  }

  $$.ajax({
    type:'GET',
    url:'https://relive.space/api/event/'+pageId,
    dataType:'json',
    success:function(data) {
      if (data.eventName != null) {
        eventName = data.eventName;
      } else {
        var options = { url: 'events.php' };
        mainView.router.load(options);
      }
      if (data.hashtags != null) {
        hashtags = data.hashtags;
      }
      $$('.title-event-name').html(decodeURI(eventName));
      updateHashtagsList(hashtags);
      sendToGoogleAnalytics(page.url, 'Relive | ' + eventName);
    }, // End Success
    error:function(data) {
      var options = { url: 'events.php' };
      mainView.router.load(options);
    }
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

  function timeDifference(current, previous) {
    var msPerMinute = 60;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var time = 0;
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return elapsed + ' seconds ago';

    } else if (elapsed < msPerHour) {
      time = Math.round(elapsed/msPerMinute);
      return time + (time === 1 ? ' minute' : ' minutes') + ' ago';

    } else if (elapsed < msPerDay ) {
      time = Math.round(elapsed/msPerHour);
      return time + (time === 1 ? ' hour' : ' hours') + ' ago';

    } else if (elapsed < msPerMonth) {
      time = Math.round(elapsed/msPerDay);
      return 'around ' + time + (time === 1 ? ' day' : ' days') + ' ago';

    } else if (elapsed < msPerYear) {
      time = Math.round(elapsed/msPerMonth);
      return 'around ' + time + (time === 1 ? ' month' : ' months') + ' ago';

    } else {
      time = Math.round(elapsed/msPerYear);
      return 'around ' + time + (time === 1 ? ' year' : ' years') + ' ago';
    }
  }

  function updateEventPosts(eventPostsData) {
    var filteredPosts = [];

    if (eventPostsData != null) {
      eventPostsData.forEach(function(post){
        var hiddenPostIdKey = "relive-hidden-post-id-" + post.post_id;
        if (!post.hasGeneratedTime) {
          post.datetime = timeDifference(Math.floor(Date.now() / 1000), post.datetime);
          post.hasGeneratedTime = true;
        }
        if (!post.hasModifiedURL) {
          post.postURL = modifyURLSchema(post.postURL, post.author);
          post.hasModifiedURL = true;
        }
        if (!isPostHiddenInLocalStorage(hiddenPostIdKey)) {
          posts.push(post);
        }
      });
      lastLoadedIndex += eventPostsData.length; // Count all included hidden items
    }

    // Filter posts based on what the user has chose to hide
    if (filteredHashtags.length > 0) {
      for (var i = 0; i < posts.length; i++) {
        var currPost = posts[i];
        var isMatch = false;
        for (var j = 0; j < filteredHashtags.length; j++) {
          for (var k = 0; k < currPost.hashtags.length; k++) {
            if (currPost.hashtags[k].toUpperCase() === filteredHashtags[j].toUpperCase()) {
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
              '<a href="{{postURL}}" target="_blank" class="relive-external-post-url">' +
                '{{#if providerName}}' +
                '<i class="icon ion-social-{{providerName}}-outline"></i>' +
                '{{else}}' +
                '<i class="icon ion-social-twitter-outline"></i>' +
                '{{/if}}' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<div class="swipeout-actions-right">' +
            '<a href="#" id="swipeToHideURL" class="swipeout-delete">Hide Post</a>' +
          '</div>' +
          '<div class="swipeout-actions-left">' +
            '<a href="#" class="swipeout-close swipeToSaveFavourites" relive-post-id="{{post_id}}" relive-post-content="{{caption}}" relive-post-author="{{author}}" relive-post-provider="{{providerName}}" {{#if media}}relive-favourite-post-img-url="{{media.data.0.mediaURL}}"{{/if}}>Save to Favourites</a>' +
          '</div>' +
        '</li>',


      height: function (post) {
        var baseHeight = 110;
        var mediaHeight = 350;
        var postRows = 1;
        var captionWithMediaRowHeight = 19;
        var captionWithoutMediaRowHeight = 27;
        var charactersWithMediaPerRow = 40;
        var charactersWithoutMediaPerRow = 27;

        if (post.media) {
          if (post.caption) {
            if (post.caption.length > charactersWithMediaPerRow) {
              postRows = post.caption.length / charactersWithMediaPerRow;
            }
          }
          baseHeight += mediaHeight;
          baseHeight += (postRows * captionWithMediaRowHeight);
        } else {
          if (post.caption) {
            if (post.caption.length > charactersWithoutMediaPerRow) {
              postRows = post.caption.length / charactersWithoutMediaPerRow;
            }
            baseHeight += (postRows * captionWithoutMediaRowHeight);
          }
        }

        return baseHeight;
      },

      onItemsBeforeInsert: function (list, fragment) {
        for (var i = list.currentFromIndex; i <= list.currentToIndex; i++) {
          var post = list.items[i];
          if (!post.hasGeneratedTime || !post.hasModifiedURL) {
            if (!post.hasGeneratedTime) {
              post.datetime = timeDifference(Math.floor(Date.now() / 1000), post.datetime);
              post.hasGeneratedTime = true;
            }
            if (!post.hasModifiedURL) {
              post.postURL = modifyURLSchema(post.postURL, post.author);
              post.hasModifiedURL = true;
            }
            list.replaceItem(i, post);
          }
        }
      },

      onItemsAfterInsert: function (list, fragment) {
        $$('.swipeout').on('deleted', deletePost);
        $$('.swipeToSaveFavourites').on('click', savePost);
        $$('.relive-photobrowser-lazy').on('click', openPhoto);

        $$('a.relive-external-post-url').on('click', function(e) {
          e.preventDefault();
          var post = $$(this);

          if (!post[0].hasExternalURLHandler) {
            post[0].hasExternalURLHandler = true;
            var externalURL = post.attr('href');
            window.open(externalURL, "_blank");
            setTimeout(function(){
              post[0].hasExternalURLHandler = false;
            }, 1000);
          }

          return false;
        });

        function deletePost() {
          var relivePostId = $$(this).attr('relive-post-id');
          var hiddenPostIdKey = "relive-hidden-post-id-" + relivePostId;

          if (isPostHiddenInLocalStorage(hiddenPostIdKey)) {
            return;
          }
          $$.ajax({
            type:'POST',
            url:'https://relive.space/api/event/'+pageId+'/report',
            data:{"post_id":relivePostId},
            dataType:'text',
            success:function(data) {
            } // End Success
          });
          storeHiddenPostsToLocalStorage(hiddenPostIdKey, relivePostId);
        }

        function savePost() {
          var post = $$(this);

          var postId = post.attr('relive-post-id');
          var author = post.attr('relive-post-author');
          var caption = post.attr('relive-post-content');
          var provider = post.attr('relive-post-provider');
          var postURL = post.attr('relive-post-url');
          var mediaURL = post.attr('relive-favourite-post-img-url');
          var favourites = loadJsonFromLocalStorage(reliveFavouritesKey);
          var favouritesContainsFavourite = false;
          var favourite = {post_id: postId, author: author, caption: caption, providerName: provider, media: mediaURL, postURL: postURL};

          if (favourites == null) {
            favourites = [];
          }

          for (var i = 0; i < favourites.length; i++) {
            if (favourites[i].post_id == favourite.post_id) {
              favouritesContainsFavourite = true;
            }
          }

          if (!favouritesContainsFavourite) {
            if (mediaURL != null) {
              storeImgToLocalStorage(mediaURL, mediaURL);
            }
            favourites.push(favourite);
            toast.show(true);
            storeJsonToLocalStorage(reliveFavouritesKey, favourites);
          }
        }

        function openPhoto() {
          var post = $$(this);
          if (!post[0].hasPhotoHandler) {
            var mediaURL = post.attr('relive-mediabrowser-url');
            var mediaCaption = post.attr('relive-mediabrowser-caption');
            var mediaObjects = [{url: mediaURL, caption: mediaCaption}];

            // Initialize Media Browser
            var relivePhotoBrowser = myApp.photoBrowser({
                photos: mediaObjects,
                theme: 'dark',
                navbar: true,
                toolbar: false,
                onClose: function (photobrowser) {
                  post[0].hasPhotoHandler = false;
                }
            });
            post[0].hasPhotoHandler = true;
            relivePhotoBrowser.open();
          }
        }
      }
    }); // End virtualList initialization

    // Incrementally fetch more posts automatically if no results
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
        if (!navigator.onLine) {
          if (post.media != "") {
            var loadedBase64Img = loadImgFromLocalStorage(post.media);
            if (loadedBase64Img != null) {
              post.media = loadedBase64Img;
            }
          }
        }
        if (!post.hasModifiedURL) {
          post.postURL = modifyURLSchema(post.postURL, post.author);
          post.hasModifiedURL = true;
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
                '{{#if postURL}}' +
                '<a href="{{postURL}}" target="_blank" class="relive-external-post-url">' +
                '{{/if}}' +
                  '{{#if providerName}}' +
                  '<i class="icon ion-social-{{providerName}}-outline"></i>' +
                  '{{else}}' +
                  '<i class="icon ion-social-twitter-outline"></i>' +
                  '{{/if}}' +
                '{{#if postURL}}' +
                '</a>' +
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
        onItemsBeforeInsert: function (list, fragment) {
          for (var i = list.currentFromIndex; i <= list.currentToIndex; i++) {
            var post = list.items[i];
            if (!post.hasModifiedURL && post.postURL != null) {
              post.postURL = modifyURLSchema(post.postURL, post.author);
              post.hasModifiedURL = true;
              list.replaceItem(i, post);
            }
          }
        },
        onItemsAfterInsert: function (list, fragment) {
          $$('.swipeout').on('deleted', deleteFavouritePost);
          $$('.relive-photobrowser-lazy').on('click', openPhoto);
          $$('a.relive-external-post-url').on('click', function(e) {
            e.preventDefault();
            var post = $$(this);

            if (!post[0].hasExternalURLHandler) {
              post[0].hasExternalURLHandler = true;
              var externalURL = post.attr('href');
              window.open(externalURL, "_blank");
              setTimeout(function(){
                post[0].hasExternalURLHandler = false;
              }, 1000);
            }

            return false;
          });

          function deleteFavouritePost() {
            var relivePostId = $$(this).attr('relive-post-id');
            var newPostsAfterDelete = [];
            var isDeleted = false;

            for (var i = 0; i < posts.length; i++) {
              if (posts[i].post_id !== relivePostId) {
                newPostsAfterDelete.push(posts[i]);
              } else {
                isDeleted = true;
                if (posts[i].media != null) {
                  removeItemFromLocalStorage(posts[i].media);
                }
              }
            }
            if (isDeleted) {
              posts = newPostsAfterDelete;
              storeJsonToLocalStorage(reliveFavouritesKey, posts);
            }
          }

          function openPhoto() {
            var post = $$(this);
            if (!post[0].hasPhotoHandler) {
              var mediaURL = post.attr('relive-mediabrowser-url');
              var mediaCaption = post.attr('relive-mediabrowser-caption');
              var mediaObjects = [{url: mediaURL, caption: mediaCaption}];

              // Initialize Media Browser
              var relivePhotoBrowser = myApp.photoBrowser({
                  photos: mediaObjects,
                  theme: 'dark',
                  navbar: true,
                  toolbar: false,
                  onClose: function (photobrowser) {
                    post[0].hasPhotoHandler = false;
                  }
              });
              post[0].hasPhotoHandler = true;
              relivePhotoBrowser.open();
            }
          }
        }
    }); // End virtualList initialization
  }

  var favouritePostsData = loadJsonFromLocalStorage(reliveFavouritesKey);
  reloadFavouritePosts(favouritePostsData);
});

// Hides and Shows filter hashtag list when appropriate
myApp.onPageAfterAnimation('landing', function (page) {
  $$('.relive-panel-favourites-reel').removeClass('hidden');
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').addClass('hidden');
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
myApp.onPageAfterAnimation('home', function (page) {
  $$('.relive-panel-favourites-reel').removeClass('hidden');
  $$('div.event-hashtags-block').addClass('hidden');
});
myApp.onPageAfterAnimation('event', function (page) {
  $$('.relive-panel-favourites-reel').removeClass('hidden');
  $$('div.event-hashtags-block').removeClass('hidden');
  $$('.navbar').removeClass('hidden');
});
myApp.onPageAfterAnimation('events', function (page) {
  $$('.relive-panel-favourites-reel').removeClass('hidden');
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').removeClass('hidden');
  var mySearchbar = $$('.searchbar')[0].f7Searchbar;

  // Search if there's a query
  if (page.query.q != null) {
    mySearchbar.search(page.query.q);
  }
});
myApp.onPageAfterAnimation('favourites', function (page) {
  $$('.relive-panel-favourites-reel').addClass('hidden');
  $$('div.event-hashtags-block').addClass('hidden');
  $$('.navbar').removeClass('hidden');
});
myApp.onPageAfterAnimation('form', function (page) {
  $$('.relive-panel-favourites-reel').removeClass('hidden');
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
      pushState: true
  };
  storeUserCreatedReelToLocalStorage(eventDetails.event_id, eventDetails.eventName);
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

function showNoConnectionToast() {
  var noConnectionToast = myApp.toast('No Connection', '<div>✘</div>', {});
  noConnectionToast.show(true);
}

function showHasConnectionToast() {
  var hasConnectionToast = myApp.toast('Connected', '<div>✔</div>', {});
  hasConnectionToast.show(true);
}

window.addEventListener('online', function (event) {
  //showUserNotification('Connected to the Internet','All features are available.');
  showHasConnectionToast();
}, false);

window.addEventListener('offline', function (event) {
  // showUserNotification('No internet connectivity','Some features and functionalities will be restricted.');
  showNoConnectionToast();
}, false);
