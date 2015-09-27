define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var actorList = flight.component(function(){

		this.attributes({
			main: '#actorList',
			closeModal: '#closeActorList'
		});

		this.showActors = function(ev,d){
			console.log(d);
			//image path is https://image.tmdb.org/t/p/w45/[imagename]
			//$('#actorList').removeClass('hide');
			//console.log($('#actorList').removeClass('hide'));
		};

		this.closeModal = function(ev,d){
			$('#actorList').addClass('hide');
		};

		this.after('initialize', function(){
			this.on(document, 'showActors', this.showActors);
			this.on(this.select('closeModal'), 'click', this.closeModal);
		});

	}, withAjax);

	return actorList;
});