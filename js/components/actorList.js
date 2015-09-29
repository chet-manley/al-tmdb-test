//attaches to #movieList in index.html
define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var actorList = flight.component(function(){

		this.attributes({
			closeModal: '#closeActorList',
			actors: '.actor-list',
			message: '#modalMessage'
		});

		//displays actors from returned search query
		this.showActors = function(ev,d){
			if(d.total_results === 0){
				this.select('message').html('No Dice.');
				$('#actorList').removeClass('hide');
			}
			else{
				this.select('message').html('found '+d.total_results+' people');
				this.select('actors').render(d.results, {
					profile_path: {
						html: function(params){
							if(this.profile_path !== null) return '<img src="https://image.tmdb.org/t/p/w45'+this.profile_path+'">';
							else return '';
						}
					}
				});
				$('#actorList').removeClass('hide');
			}
		};

		//closes actor list modal
		this.closeModal = function(ev,d){
			$('#actorList').addClass('hide');
		};

		//once an actor is select, this triggers the movieList.js component
		this.showMovies = function(ev,d){
			var actorID = $(ev.target).parent('li').children('span.hide').html();
			if(actorID === undefined) actorID = $(ev.target).parent('span').parent('li').children('span.hide').html();
			$('#actorList').addClass('hide');
			this.json('GET', '/3/person/'+actorID+'/movie_credits', {}, 'showMovies');
		};

		this.after('initialize', function(){
			this.on(document, 'showActors', this.showActors);
			this.on(this.select('closeModal'), 'click', this.closeModal);
			this.on(this.select('actors'), 'click', this.showMovies);
		});

	}, withAjax);

	return actorList;
});