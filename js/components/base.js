define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var base = flight.component(function(){

		this.attributes({
			searchName: '#searchName',
					go: '#executeSearch'
		});

		this.testClick = function(ev,d){
			console.log($(ev.target));
		};

		this.after('initialize', function(){
			this.on(document, 'click', this.testClick);
		});

	}, withAjax);

	return base;
});