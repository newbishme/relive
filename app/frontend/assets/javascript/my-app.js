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


// var homeTemplate = $$('#homeTemplate').html();
// var compiledHomeTemplate = Template7.compile(homeTemplate);

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

// Callbacks to run specific code for specific pages, for example for Home data page:
myApp.onPageInit('home', function (page) {

  // Render landing page template for events
  // var context = {
  //   eventName: 'Hello world'
  // };
  // var homeHTML = compiledHomeTemplate(template7Data);
  // $$('div#home-landing-events').html(homeHTML);

});


// Initialize Search bar
var eventsSearchbar = myApp.searchbar('.searchbar', {
  searchList: '.list-block-search',
  searchIn: '.card-header'
});

// Initialize Virtual List
var eventsList = myApp.virtualList('div#home-landing-events', {
  items: [
    {
      title: "Event 1",
      image: "http://lorempixel.com/1000/600/nature/3/"
    },
    {
      title: "Event 2",
      image: "http://lorempixel.com/1000/600/nature/3/"
    },
    {
      title: "Event 3",
      image: "http://lorempixel.com/1000/600/nature/3/"
    },
    {
      title: "Event 4",
      image: "http://lorempixel.com/1000/600/nature/3/"
    },
    {
      title: "Event 5",
      image: "http://lorempixel.com/1000/600/nature/3/"
    }
  ],
  template: '<li class="item-content">' +
              '<div class="item-inner">' +
                '<div class="card event-card-header-img">' +
                  '<div style="background-image:url({{image}})" valign="bottom" class="card-header color-white no-border">{{title}}</div>' +
                  '<div class="card-footer"><a href="#" class="link">View Event</a>' +
                '</div>' +
              '</div>' +
            '</li>',

  height: 700,
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

// Initialize the app
myApp.init();
