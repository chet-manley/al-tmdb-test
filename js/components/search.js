//attaches to #searchBox in index.html
define(['jquery', 'flight', 'transparency', 'withAjax'],
function($,        flight,   transparency,   withAjax){

	var search = flight.component(function(){

		this.attributes({
			searchName: '#searchName',
					go: '#executeSearch'
		});

		this.search = function(ev,d){
			var searchTerm = this.select('searchName').val();
			if(searchTerm !== ''){
				searchTerm = encodeURI(searchTerm);
				this.json('GET', '/3/search/person', { query: searchTerm }, 'showActors');
			}
		};

		//when enter is pressed, click go
		this.enter = function(ev,d){
			if(ev.keyCode === 13){
				this.select('go').click();
			}
		};

		this.after('initialize', function(){
			this.on(this.select('go'), 'click', this.search);
			this.on(this.select('searchName'), 'keyup', this.enter);
		});

	}, withAjax);

	return search;
});