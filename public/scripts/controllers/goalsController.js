myApp.controller('GoalsController', ['$scope', 'DataFactory', function($scope, DataFactory) {
    $scope.dataFactory = DataFactory;

    $scope.goals = $scope.dataFactory.factoryGetGoals();

    console.log('Goals: ', $scope.goals);

    if ($scope.dataFactory.factoryGoalsArray() === undefined) {
        $scope.dataFactory.factoryGetGoals().then(function() {
            $scope.goals = $scope.dataFactory.factoryGoalsArray();
        });
    } else {
        $scope.goals = $scope.dataFactory.factoryGoalsArray();
    }


}]);