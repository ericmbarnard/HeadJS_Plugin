(function(head){
	var doc = document,
		links = {},
		queue = [];
	
	//scan head for other CSS files
	(function(){
		var stylesheets = doc.getElementsByTagName("LINK");
		if(stylesheets.length > 0){
			for(var i=0;i<stylesheets.length; i++){
				links[stylesheets[i].href] = true;		
			}
		}
	}());
	
		
	var cssQueue = (function(){
		
		var processQueue = function(){
			
			//FIFO logic
			if(queue.length > 0){
				var link = queue.shift();

				doc.getElementsByTagName("HEAD")[0].appendChild(link);
			}
		};

		return {
			
			addToQueue: function(link){
				if(!links[link.href]){
					links[link.href] = true; //make sure we don't do this again!
					//add to the queue
					queue.push(link);
					setTimeout(processQueue, 4);
				}
			}
		};
	}());	

	var css = function(resource){
		var link = doc.createElement("LINK");

		link.href = resource;
		link.type = 'text/css';
		link.setAttribute("rel", "stylesheet");

		cssQueue.addToQueue(link);

		return this;	
	};

	head.css = css;
	
}(window.head = window.head || {}));