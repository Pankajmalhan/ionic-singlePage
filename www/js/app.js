// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var appMod = angular.module('starter', ['ionic', 'angularMoment']);
appMod.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.tabs.position('top');
});
appMod.controller('redditCtrl', function ($scope, $http) {

    document.addEventListener("offline", onOffline, false);
    var count = 0;
    function onOffline() {
        count = count + 1;
        alert("You r offlkine now !" + count);
        
    }

    $scope.title = "ALL";
    $scope.hotURL = '';
    $scope.topURL = '';
    $scope.newURL = '';
    $scope.risingURL = '';
    $scope.NEWSContent = [];

    $scope.Load_SubReddits = function (url_) {
        $scope.NEWSContent = [];
        $scope.title = url_.split('/')[4].toUpperCase();
        $http({
            method: 'GET',
            url: url_
        }).then(function successCallback(response) {

            angular.forEach(response.data.data.children, function (child) {
                if (!child.data.thumbnail|| child.data.thumbnail === 'self' || child.data.thumbnail === 'default') {
                    child.data.thumbnail = 'http://www.redditstatic.com/icon.png';
                }
                $scope.NEWSContent.push(child.data);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hotURL = 'https://www.reddit.com/r/' + $scope.title + '/hot/.json';
            $scope.topURL = 'https://www.reddit.com/r/' + $scope.title + '/top/.json';
            $scope.newURL = 'https://www.reddit.com/r/' + $scope.title + '/new/.json';
            $scope.risingURL = 'https://www.reddit.com/r/' + $scope.title + '/rising/.json';
        }, function errorCallback(response) {

            console.log(response);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    
    $scope.category = function (url_) {
        $http({
            method: 'GET',
            url: url_
        }).then(function successCallback(response) {
            $scope.NEWSContent = [];
            angular.forEach(response.data.data.children, function (child) {
                if (!child.data.thumbnail || child.data.thumbnail === 'self' || child.data.thumbnail === 'default') {
                    child.data.thumbnail = 'http://www.redditstatic.com/icon.png';
                }
                $scope.NEWSContent.push(child.data);
            });
            
        }, function errorCallback(response) {

            console.log(response);
           
        });
    }
    $scope.openPage = function (url) {
        window.open(url, '_blank');
    }
    $scope.doRefresh = function () {
        var param = {};
        param['before'] = $scope.NEWSContent[0].name;
        var oldStory = [];
        oldStory = $scope.NEWSContent;
        var newStory = [];
        $http({
            method: 'GET',
            url: 'https://www.reddit.com/r/' + $scope.title + '/.json',
            params: param
        }).then(function successCallback(response) {
            angular.forEach(response.data.data.children, function (child) {
                newStory.push(child.data);
            });
            $scope.NEWSContent = [];
            angular.forEach(newStory, function (data) {
                $scope.NEWSContent.push(data);
            });
            angular.forEach(oldStory, function (data) {
                $scope.NEWSContent.push(data);
            });

            $scope.$broadcast('scroll.refreshComplete');
            $scope.hotURL = 'https://www.reddit.com/r/' + $scope.title + '/hot/.json';
            $scope.topURL = 'https://www.reddit.com/r/' + $scope.title + '/top/.json';
            $scope.newURL = 'https://www.reddit.com/r/' + $scope.title + '/new/.json';
            $scope.risingURL = 'https://www.reddit.com/r/' + $scope.title + '/rising/.json';
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.loadMore = function () {
        var param = {};
        if ($scope.NEWSContent.length > 0) {
            param['after'] = $scope.NEWSContent[$scope.NEWSContent.length - 1].name;
        }
       
        $http({
            method: 'GET',
            url: 'https://www.reddit.com/r/' + $scope.title + '/.json',
            params:param
        }).then(function successCallback(response) {
           
            angular.forEach(response.data.data.children, function (child) {
                if (!child.data.thumbnail || child.data.thumbnail === 'self' || child.data.thumbnail === 'default') {
                    child.data.thumbnail = 'http://www.redditstatic.com/icon.png';
                }
                $scope.NEWSContent.push(child.data);
                $scope.hotURL = 'https://www.reddit.com/r/' + $scope.title + '/hot/.json';
                $scope.topURL = 'https://www.reddit.com/r/' + $scope.title + '/top/.json';
                $scope.newURL = 'https://www.reddit.com/r/' + $scope.title + '/new/.json';
                $scope.risingURL = 'https://www.reddit.com/r/' + $scope.title +'/rising/.json';
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function errorCallback(response) {

            console.log(response);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
    

});

appMod.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.cordova && window.cordova.InAppBrowser){
        window.open = window.cordova.InAppBrowser.open;
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

