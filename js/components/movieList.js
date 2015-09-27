define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var movieList = flight.component(function(){

		this.attributes({
			main: '#movieList'
		});

		this.showMovies = function(ev,d){
			console.log(this.select('main'));
			this.select('main').removeClass('hide');
		};

		this.after('initialize', function(){
			this.on(document, 'showMovies', this.showMovies);
		});

	}, withAjax);

	return movieList;
});