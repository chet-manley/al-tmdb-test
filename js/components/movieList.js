define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var movieList = flight.component(function(){

		this.attributes({
			selectedActor: '#selectedActor',
			movies: '#movies'
		});

		this.showMovies = function(ev,d){
			this.select('movies').render(d.cast, {
				poster_path: {
					src: function(params){
						if(this.poster_path === null) return '';
						else return 'https://image.tmdb.org/t/p/w154'+this.poster_path;
					}
				}
			});
			$('#movieList').removeClass('hide');
		};

		this.after('initialize', function(){
			this.on(document, 'showMovies', this.showMovies);
		});

	}, withAjax);

	return movieList;
});