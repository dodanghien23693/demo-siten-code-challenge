'use strict';

var team1 = angular.module('team1', [
    'ngAnimate',
    'ngCookies',
    //'ngResource',
    //'ngRoute',
    //'ngSanitize',
    'ngTouch',
    'ui.router'
])

.config(function ($stateProvider, $locationProvider) {
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'app/views/home.html',
        controller: 'MainCtrl',
    })
    .state('login', {
        url: '/login',
        templateUrl: 'app/views/login.html'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'app/views/register.html',
        controller: 'MainCtrl'
    })

   

    if (window.history && window.history.pushState) {
        
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }   
}
  );




