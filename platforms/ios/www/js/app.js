// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'pascalprecht.translate', 'ngCookies', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      //google analytics
      var analytics = navigator.analytics;
      // set the tracking id
      analytics.setTrackingId('UA-18336159-5');
      analytics.sendAppView('home', function(){
        console.log('google ok');
      }, function(){
        console.log('google error');
      });

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'templates/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('tab.magnet-detail', {
        url: '/detail/:hash',
        views: {
          'tab-search': {
            templateUrl: 'templates/magnet-detail.html',
            controller: 'MagnetDetailCtrl'
          }
        }
      })

      .state('tab.favourite', {
        cache: false,
        url: '/favourite',
        views: {
          'tab-favourite': {
            templateUrl: 'templates/tab-favourite.html',
            controller: 'FavouriteCtrl'
          }
        }
      })

      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('agreement', {
        url: '/agreement',
        templateUrl: 'templates/agreement.html',
        controller: 'AgreementCtrl'
        /*views: {
          'tab-settings': {
            templateUrl: 'templates/agreement.html',
            controller: 'AgreementCtrl'
          }
        }*/
      })


    ;


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/search');

  })
  .config(['$translateProvider', function ($translateProvider, $translate) {
    $translateProvider.useLocalStorage();

    // Adding a translation table for the English language
    $translateProvider.translations('en-US', {
      "Search Magnet Links": "Serach Magnet Links",
      "Search": "Search",
      "Magnet Detail":"Magnet Detail",
      "Favourite": "Favourite",
      "Settings": "Settings",
      "Enable Proxy": "Enable Proxy",
      "Loading": "Loading...",
      "Network Error":"Network Error",
      "Search Magnets Link":"Search Magnets Link",
      "Copy":"Copy",
      "Share":"Share",
      "Type keywords here":"Type keywords here",
      "End User Agreement":"End User Agreement",
      "Agree to this Agreement":"Agree to this Agreement",
      "Information":"Information",
      "Hash":"Hash",
      "Number of Files":"Number of Files",
      "Content Size":"Content Size",
      "Convert On":"Convert On",
      "File List":"File List",
      "Copied":"Copied",
      "Added to Favourite":"Added to Favourite",
      "Contain black words":"Contain black words",
      "Black word submitted":"Black word submitted",
      "Show black word submit form":"Show black word submit form"
    });
    // Adding a translation table for the Russian language
    $translateProvider.translations('zh-CN', {
      "Serach Magnet Links": "磁力搜索",
      "Search": "搜 索",
      "Magnet Detail":"磁力内容",
      "Favourite": "收 藏",
      "Settings": "设 置",
      "Enable Proxy": "使用代理",
      "Loading": "正在加载",
      "Network Error":"网络错误,请尝试开启设置中的代理",
      "Search Magnets Link":"点击搜索磁力链接",
      "Copy":"复制",
      "Share":"分享",
      "Type keywords here":"输入搜索的关键词",
      "End User Agreement":"使用协议",
      "Agree to this Agreement":"同意本协议",
      "Information":"种子信息",
      "Hash":"Hash",
      "Number of Files":"文件数",
      "Content Size":"文件大小",
      "Convert On":"转化时间",
      "File List":"文件列表",
      "Copied":"已复制",
      "Added to Favourite":"已收藏",
      "Contain black words":"搜索的关键词包含不良词汇，请更换其他关键词搜索",
      "Black word submitted":"不良词汇已经提交",
      "Show black word submit form":"提交不良词汇"
    });

    var preferredLanguage = "zh-CN";
    if (angular.isString(window.localStorage.getItem("NG_TRANSLATE_LANG_KEY"))) {
      preferredLanguage = window.localStorage.getItem("NG_TRANSLATE_LANG_KEY");
    } else {
      if (navigator.language == "zh-CN") {
        preferredLanguage = "zh-CN";
      } else {
        preferredLanguage = "en-US";
      }
    }
    $translateProvider.useSanitizeValueStrategy(null);
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage(preferredLanguage);
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();

  }])
;
