define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var search = flight.component(function(){

		this.attributes({
			searchName: '#searchName',
					go: '#executeSearch'
		});

		this.search = function(ev,d){
			this.trigger(document, 'showActors', {test: 'crap'});
		};

		this.after('initialize', function(){
			this.on(this.select('go'), 'click', this.search);
		});

	}, withAjax);

	return search;
});