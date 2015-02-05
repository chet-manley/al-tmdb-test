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
					},
					actorImgPath : 'https://image.tmdb.org/t/p/w45',
					movieImgPath : 'https://image.tmdb.org/t/p/w154'
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
				// Accepts a proper request object as req param
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
			 * @param search = string
			 */
			svc.getActors = function getActors(search) {
				// exit if query is not a string or is 4 characters or less
				if (typeof search !== 'string' || search.length <= 4) {
					svc.lastErr = 'Invalid query.';
					return $q.reject(svc.lastErr);
				}
				
				return doSearch({
					method: request.method,
					url: request.url + '/search/person',
					headers: request.headers,
					params: {
						api_key: request.params.api_key,
						query: encodeURIComponent(search)
					}
				})
					.then(function (response) {
						var actor;
						if (!response || response.total_results === 0) {return $q.reject('No actors matching ' + decodeURI(search) + ' were found.'); }
						// clear previous entries
						svc.actors = {};
						// create our own actors object with relevant info
						for (actor in response.results) {
							if (response.results.hasOwnProperty(actor)) {
								svc.actors[actor] = {
									name : response.results[actor].name,
									id : response.results[actor].id,
									popularity : response.results[actor].popularity
								};
								// add img url if it exists
								if (response.results[actor].profile_path) {
									svc.actors[actor].imgUrl = config.actorImgPath + response.results[actor].profile_path;
								}
							}
						}
					});
			};
			/*
			 * Perform Movie search using Actor's ID.
			 * @param search = number
			 */
			svc.getMovies = function getMovies(search) {
				// exit if query is not a number
				if (typeof search !== 'number') {
					svc.error = 'Invalid query.';
					return $q.reject(svc.lastErr);
				}
				// turn search query into URI compatible string
				search = encodeURIComponent(search);
				
				return doSearch({
					method: request.method,
					url: request.url + '/person/' + search + '/movie_credits',
					headers: request.headers,
					params: request.params
				})
					.then(function (response) {
						var movie;
						if (!response || !response.cast) {return $q.reject('No movies were found for this actor.'); }
						// clear previous entries
						svc.movies = {};
						// create our own movies object with relevant info
						for (movie in response.cast) {
							if (response.cast.hasOwnProperty(movie)) {
								svc.movies[response.cast[movie].id] = {
									title : response.cast[movie].title,
									date : response.cast[movie].release_date
								};
								// add img url if it exists
								if (response.cast[movie].poster_path) {
									svc.movies[response.cast[movie].id].imgUrl = config.movieImgPath + response.cast[movie].poster_path;
								}
							}
						}
						//svc.movies = response.cast;
					});
			};

			return svc;
		// end searchService factory
		})
		.controller('appController', function (searchService) {
			var ctrl = this;
			ctrl.actor = '';
			ctrl.actors = {};
			ctrl.actorId = 0;
			ctrl.movies = {};
			ctrl.imgPath = 'https://image.tmdb.org/t/p';
			ctrl.profileImgSize = '/w45';
			ctrl.modal = {
				visible : false,
				message : '',
				closeBtn : true,
				close : function close() {
					ctrl.modal.visible = false;
					ctrl.modal.message = '';
				}
			};
			// search for actor
			ctrl.doActorSearch = function doActorSearch() {
				ctrl.modal.visible = true;
				ctrl.modal.message = 'Searching...';
				searchService
					// send text in search box to search service
					.getActors(ctrl.searchName)
					// result
					.then(function () {
						ctrl.actors = searchService.actors;
						ctrl.modal.message = false;
					// error
					}, function (reason) {
						ctrl.modal.message = reason;
					});
			};
			/*
			 * TODO: select actor from list
			 * default to first in list
			 */
			// do movie search by actor ID
			ctrl.doMovieSearch = function doMovieSearch(actor) {
				ctrl.modal.visible = true;
				ctrl.modal.message = 'Searching...';
				// cache actor's id and name
				ctrl.actorId = actor.id;
				ctrl.actor = actor.name;
				// replace text in input element with actor's name
				ctrl.searchName = actor.name;
				searchService
					// send actor ID number to search service
					.getMovies(ctrl.actorId)
					// result
					.then(function () {
						ctrl.movies = searchService.movies;
						ctrl.modal.close();
						console.log(ctrl.movies);
					// error
					}, function (reason) {
						ctrl.modal.message = reason;
					});
			};
		})
		.directive('inputEnter', function inputEnter() {
			return function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if (event.which === 13) {
						scope.$apply(function () {
							scope.$eval(attrs.inputEnter);
						});
						event.preventDefault();
					}
				});
			};
		});
}(angular));