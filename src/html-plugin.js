(function(head){
	var doc = document,
		container = document.createElement("DIV"),
		ids = {},
		urls = {},
		isReady = false;
		templates = {};

	head.ready(function(){
		isReady = true;
		injectTemplates();
	});

	var tmplProcessor = (function(){
		var getXHR = function(){
			try{
				return new XmlHttpRequest();
			}catch(e){
				try{
					return new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e){
					return new ActiveXObject("Msxml2.XMLHTTP");
				}
			}
		};
		
		var ajax = function(options){
			var xhr = getXHR();
			
			xhr.open('GET', options.url, true); //true for async
			xhr.setRequestHeader("Accept", 'text/plain');
			xhr.onreadystatechange = function(event){
				if(xhr.readyState == 4){ //finished
					if(xhr.status != 200){ //NOT OK!
						
						throw xhr.responseText;
					}
					else { options.success(xhr.responseText); }
				}	
			};
			xhr.send(null);
		};



		var ajaxSuccessHandler = function(id, responseText){
			var template,
				holder = doc.createElement("DIV");
			
			holder.innerHTML = responseText;
			templates[id] = holder;
			injectTemplates();				
		};

		return {
			
			fetchTmpl: function(id, url){
				ajax({
					url: url,
					success: function(responseText){
						ajaxSuccessHandler(id, responseText);
					}
				});
			}
		};
	}());
	
	var injectTemplates = function(){
		if(isReady){
			//stick all the templates in the DOM!
			for(template in templates){
				if(templates.hasOwnProperty(template)){
					doc.body.appendChild(templates[template]);
					delete templates[template];
				}
			}
		}

	};
	
	var checkForExistingTmpl = function(id, url){
		var preLoaded = false;

		if(ids[id]){ preLoaded = true; }
		if(doc.getElementById(id)){ preLoaded = true; }
		if(templates[url]){ preLoaded = true; }

		return preLoaded;
	};

	var tmpl = function(id, url){
		
		if(!checkForExistingTmpl(id, url)){
			tmplProcessor.fetchTmpl(id, url);
		}

		ids[id] = true;
		urls[url] = true;

		return this;
	};

	head.tmpl = tmpl;
}(window.head = window.head || {}));