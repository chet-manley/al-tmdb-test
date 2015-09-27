//Ajax
define(['jquery'], function($){

	//Primary XHR mechanism
	//example: this.json('GET', 'https://exam.ple/something', {key: 'value'}, 'someEventName');
	function withAjax(){
		/*Note! Triggers don't seem to pass but the first object in the array of objects originally sent from here
		  I dont think i can pass arrays as a primary variable, only objects, but passing arrays of objects as a member (e.g. data.docs) works fine
		  Use this hack on the event-handler side or pass the array as a member, your choice.
		  var samuriSlice = [].slice.call(arguments).slice(1);
		*/
		this.json = function(method, url, rData, evName, evNode){
			var $this = this;
			rData['api_key'] = '04b98b8b92e93eff9a43f607200e084f';//add api key
			var request = $.ajax({ type: method, url: 'https://api.themoviedb.org'+url, dataType: 'json', data: rData });
			request.done(function(data){
				if(evNode){//DOM Node Specified
					$this.trigger(evNode, evName, data);
				}
				else if(evName){//Default DOM Node
					$this.trigger(evName, data);
				}
			});
			request.fail(function(jqXHR){
				//$this.trigger(document, 'ajaxError');
				if(jqXHR.status === 400 || jqXHR.status === 401){
					window.location = '/login.html';
				}
			});
		};
	}

	return withAjax;
});