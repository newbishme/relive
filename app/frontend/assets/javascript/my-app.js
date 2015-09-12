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


var homeTemplate = $$('#homeTemplate').html();
var compiledHomeTemplate = Template7.compile(homeTemplate);

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
  var context = {
    eventName: 'Hello world'
  };
  var homeHTML = compiledHomeTemplate(template7Data);
  $$('div#home-landing-events').html(homeHTML);

});


// Initialize Search bar
myApp.searchbar('.searchbar', {
  customSearch: true//, // Custom search functionality like calling external API with search results
  //onSearch: someFunction(), onEnable: someFunction(), onDisable: function(), onClear: function()
});

// Initialize the app
myApp.init();
