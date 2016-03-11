var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/newGoal', {
            templateUrl: '/views/templates/newGoal.html',
            controller: 'NewGoalController'
        })
        .when('/goals', {
            templateUrl: '/views/templates/goals.html',
            controller: 'GoalsController'
        })
        .when('/tasks', {
            templateUrl: '/views/templates/tasks.html',
            controller: 'TasksController'
        })
        .otherwise({
            redirectTo: 'goals'
        });
}]);