myApp.controller('NewGoalController', ['$scope', 'DataFactory', function($scope, DataFactory) {
    $scope.dataFactory = DataFactory;

    $scope.submitGoal = function() {
        var newGoal = {
            name: $scope.name,
            deadline: $scope.deadline,
            description: $scope.description
        };
        $scope.dataFactory.factorySubmitGoal(newGoal);
    }
}]);