angular.module('alTMDBApp', [])
	.controller('actorSearchController', ['$scope', function ($scope) {
		'use strict';
		$scope.results = [
			{text : 'learn angular', done : true},
			{text : 'build an angular app', done : false}
		];

		$scope.addResult = function () {
			$scope.results.push({text : $scope.todoText, done : false});
			$scope.todoText = '';
		};

		$scope.remaining = function () {
			var count = 0;
			angular.forEach($scope.results, function (result) {
				count += result.done ? 0 : 1;
			});
			return count;
		};

		$scope.archive = function () {
			var oldTodos = $scope.todos;
			$scope.todos = [];
			angular.forEach(oldTodos, function (todo) {
				if (!todo.done) {$scope.todos.push(todo); }
			});
		};
	}]);