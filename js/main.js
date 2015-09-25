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
		base: 'components/base',

		//Mixins
		withAjax: 'mixins/withAjax'
	}
});

//Primary Init
requirejs(['jquery','flight', 'base'],
function(   $,       flight,   base){
	
	//Attach Flight Components to DOM
	base.attachTo('#main');

});