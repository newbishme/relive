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
    // Enable Material theme for Android device only
    material: isAndroid ? true : false,
});

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}
