myApp.factory('DataFactory', ['$http', function($http) {

    // PRIVATE

    var goals = undefined;

    var completeGoals = undefined;

    var goalForTasks = undefined;

    var tasks = undefined;

    var privateSubmitGoal = function(goal) {
        var promise = $http.post('/data/goal', goal).then(function(response) {
            console.log('The response is: ', response);
            privateGetGoals();
        });
        return promise;
    };

    var privateSubmitTask = function(task, goalID) {
        var promise = $http.post('/data/task/' + goalID, task).then(function(response) {
            console.log('The response for the task you submitted is: ', response);
            //privateGetTasks(); //not yet created
        });
        return promise;
    };

    var privateGetGoals = function() {
        var promise = $http.get('/data').then(function(response) {
            goals = response.data;

            // adding a Boolean value called 'selected' to each goal. Default is false
            goals.forEach(function(goal, index, goals) {
                goal.selected = false;
            });

            console.log('the current goals are: ', goals);
        });
        return promise;
    };

    var privateGetCompleteGoals = function() {
        var promise = $http.get('/data/complete').then(function(response) {
            completeGoals = response.data;

            completeGoals.forEach(function(goal, index, completeGoals) {
                goal.selected = false;
            });

            console.log('the completed goals are: ', completeGoals);
        });
        return promise;
    };

    var privateGetTasks = function(goal) {
        var promise = $http.get('/data/tasks/' + goal.id).then(function(response) {
            tasks = response.data;
            console.log('the tasks for this goal are are: ', tasks);
        });
        return promise;
    };

    var privateDeleteGoal = function(goal) {
        var promise = $http.delete('/data/' + goal.id).then(function(response) {
            // I'm not exactly sure what else should go here
            console.log(response);
        });
        return promise;
    };

    var privateCompleteGoal = function(goal) {
        var promise = $http.put('/data/complete/' + goal.id, goal).then(function(response) {
            console.log(response);
        });
        return promise;
    };

    var privateSetGoalForTasks = function(goal) {
        goalForTasks = goal;
    };

    // PUBLIC

    var publicAPI = {
        factorySubmitGoal: function(goal) {
            return privateSubmitGoal(goal);
        },
        factorySubmitTask: function(task, goalID) {
            return privateSubmitTask(task, goalID);
        },
        factoryGetGoals: function() {
            return privateGetGoals();
        },
        factoryGetCompleteGoals: function() {
            return privateGetCompleteGoals();
        },
        // I could just use goalForTasks here, instead of taking in a parameter
        factoryGetTasks: function(goal) {
            return privateGetTasks(goal);
        },
        factoryGoalsArray: function() {
            return goals;
        },
        factoryCompleteGoalsArray: function() {
            return completeGoals;
        },
        factoryDeleteGoal: function(goal) {
            return privateDeleteGoal(goal);
        },
        factoryCompleteGoal: function(goal) {
            return privateCompleteGoal(goal);
        },
        factorySetGoalForTasks: function(goal) {
            return privateSetGoalForTasks(goal);
        },
        factoryGetGoalForTasks: function() {
            return goalForTasks;
        },
        factoryTasksArray: function() {
            return tasks;
        }
    };

    return publicAPI;
}]);