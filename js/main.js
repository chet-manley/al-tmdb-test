require.config({
	shim : {
		'flight': { deps: ['transparency', 'jquery'] },
		'transparency': { deps: ['jquery'] }
	},
	paths: {
		//Libraries
		  transparency: 'lib/transparency.min',
		        flight: 'lib/flight.min',
		        jquery: 'lib/jquery.min',

		//Components
		search: 'components/search',
		movieList: 'components/movieList',
		actorList: 'components/actorList',

		//Mixins
		withAjax: 'mixins/withAjax'
	}
});

//Primary Init
requirejs(['jquery','flight', 'search', 'movieList', 'actorList'],
function(   $,       flight,   search,   movieList,   actorList){
	
	//Attach Flight Components to DOM
	search.attachTo('#searchBox');
	movieList.attachTo('#movieList');
	actorList.attachTo('#actorList');

});