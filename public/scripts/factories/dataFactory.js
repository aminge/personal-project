myApp.factory('DataFactory', ['$http', function($http) {

    // PRIVATE

    var goals = undefined;

    var privateSubmitGoal = function(goal) {
        var promise = $http.post('/data', goal).then(function(response) {
            console.log('The response is: ', response);
        });
        return promise;
    };

    var privateGetGoals = function() {
        var promise = $http.get('/data').then(function(response) {
            goals = response.data;
            console.log('the goals are: ');
        });
        return promise;
    };


    // PUBLIC

    var publicAPI = {
        factorySubmitGoal: function(goal) {
            return privateSubmitGoal(goal);
        },
        factoryGetGoals: function() {
            return privateGetGoals();
        },
        factoryGoalsArray: function() {
            return goals;
        }
    };

    return publicAPI;
}]);