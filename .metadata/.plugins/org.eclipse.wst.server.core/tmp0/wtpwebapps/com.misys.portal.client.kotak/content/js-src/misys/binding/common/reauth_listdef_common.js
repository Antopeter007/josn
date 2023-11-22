dojo.provide("misys.binding.common.reauth_listdef_common");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	d.subscribe('ready',function(){
		var node	=	d.create("div", { innerHTML: "", id:"reauth_dialog_container"});
						d.place(node,d.body());
		var widgets = dj.findWidgets(dojo.byId("reauth_dialog_container"));
		dojo.forEach(widgets, function(w) {
		    w.destroyRecursive(false);
		});
		dojo.empty("reauth_dialog_container");
		
		m.xhrPost({
			url 				: m.getServletURL("/screen/AjaxScreen/action/ReAuthenticationAjax"),
			handleAs 			: "json",
			sync 				: true,
			preventCache		: true,
			content 			: {
			reauth_operation	: "GET_REAUTH_DIALOG"
			},		
			load : function(response, ioArgs)
			{   
				m._config = (m._config) || {};
				if(response.html_response)
				{
					d.byId("reauth_dialog_container").innerHTML = response.html_response;
				}
				var header	=	document.getElementsByTagName("head")[0];
				if(response.js_imports)
				{
					for(var i=0;i<response.js_imports.length;i++)
					{
						var fileref		=	document.createElement('script');
						  	fileref.setAttribute("type","text/javascript");
						  	fileref.setAttribute("src", response.js_imports[i]);
						  	header.appendChild(fileref);
					}
				}
				if(dj.byId("reauth_dialog"))
				{
					var widgets = dijit.findWidgets(dojo.byId("reauth_dialog"));
					dojo.forEach(widgets, function(w) {
					    w.destroyRecursive(true);
					});
					dj.byId('reauth_dialog').destroy(true);
				}
				dojo.parser.parse("reauth_dialog_container");
			},
			customError : function(response, ioArgs) 
			{				
				console.error(response);
				d.byId("reauth_dialog_container").innerHTML = response;
				
				dojo.parser.parse("reauth_dialog_container");
			}		
			});
	});
	})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.reauth_listdef_common_client');