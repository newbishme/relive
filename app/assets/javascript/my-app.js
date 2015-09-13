// Determine device OS
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

// Export selectors engine
var $$ = Dom7;

// Include appropriate CSS files in app, depending on device
if (isAndroid) {
    $$('head').append(
        '<link rel="stylesheet" href="assets/stylesheets/framework7.material.min.css">' +
        '<link rel="stylesheet" href="assets/stylesheets/framework7.material.colors.min.css">' +
        '<link rel="stylesheet" href="assets/stylesheets/my-app.material.css">'
    );
}
else {
    $$('head').append(
        '<link rel="stylesheet" href="assets/stylesheets/framework7.ios.min.css">' +
        '<link rel="stylesheet" href="assets/stylesheets/framework7.ios.colors.min.css">' +
        '<link rel="stylesheet" href="assets/stylesheets/my-app.ios.css">'
    );
}

$$('head').append('<link rel="stylesheet" href="assets/stylesheets/relive.min.css">');

// Change "Through" type navbar layout to "Fixed" in Material theme for Android
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}

// Initialize your app
var myApp = new Framework7({
    init: false,
    template7Pages: true, //enable Template7 rendering for pages
    material: isAndroid ? true : false,
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

  for (var i = 1; i < 10; i++) {
    var id = i;
    var title = "Event " + i;
    var image = "http://lorempixel.com/600/400/nature/" + i + "/";
    events.push({"id":id,"title":title,"image":image});
  }

  // Initialize Search bar
  var eventsSearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.card-header'
  });

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
          '<a href="events.php?id={{id}}" class="link right">View Event<i class="icon ion-ios-arrow-forward"></i></a>' +
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
});

myApp.onPageInit('events', function (page) {
  // TODO Get events from local cache, if not found, get from server
  var posts = [];

  for (var i = 1; i < 10; i++) {
    var title = "Event " + i;
    var image = "http://lorempixel.com/600/400/nature/" + i + "/";
    var author = "Author " + i;
    var content = "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.";
    posts.push({"title":title,"image":image,"author":author,"content":content});
  }

  // Initialize Virtual List
  var eventPostsList = myApp.virtualList($$(page.container).find('.virtual-list'), {
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

      height: 452,        // FIXME should be dynamic height, return X height if img post, return Y height if text post FIXME
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
