angular.module('alTMDBApp', [])
	.factory('searchService', function ($http) {
		'use strict';
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
			};
		this.actor = '';
		this.movies = {};
		
		return {
			/* 
			 * Perform Actor search using text in input field.
			 * Accepts a string as search param and a callback function as next
			 */
			fetchActors : function fetchActors(search, next) {
				// exit if query is not a string or is 4 characters or less
				if (typeof search !== 'string' || search.length <= 4) {return next('Invalid query.'); }
				// turn search query into URI compatible string
				search = encodeURIComponent(search);
				
				return $http.get(request.url + '/search/person', {params: {api_key: request.params.api_key, query: search}})
					.success(function (actors) {
						if (!actors || actors.total_results === 0) {return next('Response is empty.'); }
						return next(null, actors);
					})
					.error(function (data) {
						return next(data);
					});
			},
			/*
			 * Perform Movie search using Actor's ID.
			 * Accepts a number as search param and a callback function as next
			 */
			fetchMovies : function fetchMovies(search, next) {
				// exit if query is not a number
				if (typeof search !== 'number') {return next('Invalid query.'); }
				// turn search query into URI compatible string
				search = encodeURIComponent(search);
				
				return $http.get(request.url + '/person/' + search + '/movie_credits', request)
					.success(function (movies) {
						if (!movies || movies.total_results === 0) {return next('Response is empty.'); }
						return next(null, movies);
					})
					.error(function (data) {
						return next(data);
					});
			}
		};
	// end searchService factory
	})
	.controller('actorSearchController', function (searchService) {
		'use strict';
		this.results = {};
		this.doSearch = function doSearch() {
			searchService.fetchActors(this.actorName, function (error, actors) {
				if (error) {console.log(error); return false; }
				console.log(actors);
				console.log(actors.results[0].id);
			});
		};
	})
	.controller('movieSearchController', function (searchService) {
		'use strict';
		this.results = {};
		this.doSearch = function doSearch() {
			searchService.fetchMovies(this.actorId).success(function (movies) {
				console.log(movies);
			});
		};
	})
	.controller('movieListController', function ($scope) {
		'use strict';
		this.results = {};
	})
	.directive('movieList', function () {
		'use strict';
		return {
			scope : {
				actor : '='
			},
			templateUrl		: 'templates/movie-list.html',
			replace			: true,
			controller		: 'movieListController',
			controllerAs	: 'movieListCtrl'
		};
	});