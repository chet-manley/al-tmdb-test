(function (angular, undefined) {
	'use strict';
	angular.module('alTMDBApp', [])
		.factory('searchService', function searchService($http, $q) {
			var config = {
					api : {
						url : {
							scheme		: 'https',
							hostname	: 'api.themoviedb.org',
							path		: '/3'
						},
						key	: '04b98b8b92e93eff9a43f607200e084f'
					}
				},
				request = {
					method : 'GET',
					url : config.api.url.scheme + '://' + config.api.url.hostname + config.api.url.path,
					headers : {
						'Accept' : 'application/json'
					},
					params : {
						'api_key' : config.api.key
					}
				},
				// expects a proper request object
				doSearch = function doSearch(req) {
					return $http(req)
						.then(function (response) {
							return response.data;
						}, function (error) {
							throw error.status + " : " + error.statusText;
						});
				},
				// define our service properties
				svc = {
					actor : '',
					actors: {},
					movies: {},
					lastErr : null
				};
			// extend our service with methods
			/* 
			 * Perform Actor search using text in input field.
			 * Accepts a string as search param
			 */
			svc.getActors = function getActors(search) {
				// exit if query is not a string or is 4 characters or less
				if (typeof search !== 'string' || search.length <= 4) {
					svc.lastErr = 'Invalid query.';
					return $q.reject(svc.lastErr);
				}
				// turn search query into URI compatible string
				search = encodeURIComponent(search);
				
				return doSearch({
					method: request.method,
					url: request.url + '/search/person',
					headers: request.headers,
					params: {
						api_key: request.params.api_key,
						query: search
					}
				})
					.then(function (response) {
						if (!response || response.total_results === 0) {return $q.reject('Nothing found.'); }
						svc.actors = response;
					});
			};
			/*
			 * Perform Movie search using Actor's ID.
			 * Accepts a number as search param
			 */
			svc.getMovies = function getMovies(search) {
				// exit if query is not a number
				if (typeof search !== 'number') {
					svc.error = 'Invalid query.';
					return false;
				}
				// turn search query into URI compatible string
				search = encodeURIComponent(search);

				return $http.get(request.url + '/person/' + search + '/movie_credits', request)
					.success(function (data) {
						svc.movies = data;
					})
					.error(function (data) {
						svc.error = data;
					});
			};

			return svc;
		// end searchService factory
		})
		.controller('actorSearchController', function (searchService) {
			this.results = {};
			this.doSearch = function doSearch() {
				searchService
					.getActors(this.actorName)
					.then(function () {
						console.log(searchService.actors);
					}, function (reason) {
						console.log(reason);
					});
			};
		})
		.controller('movieSearchController', function (searchService) {
			this.results = {};
			this.doSearch = function doSearch() {
				searchService
					.getMovies(this.actorId)
					.then(function () {
						if (searchService.error) {return console.log(searchService.error); }
						console.log(searchService.movies);
					});
			};
		})
		.controller('movieListController', function ($scope) {
			this.results = {};
		})
		.directive('movieList', function () {
			return {
				scope : {
					actor : '='
				},
				templateUrl		: 'templates/movie-list.html',
				replace			: false,
				controller		: 'movieListController',
				controllerAs	: 'movieListCtrl'
			};
		});
}(angular));