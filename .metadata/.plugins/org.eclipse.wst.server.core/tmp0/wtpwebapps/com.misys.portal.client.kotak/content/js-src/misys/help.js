dojo.provide("misys.help");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions & variables go here
	
	var
		// Class for notices like "your data has been saved", etc.
		_noticeSelector = ".notice";
	
	function _helpTreeHandler( /*String*/ message) {
		// summary:
		//		TODO
		
		var nodeWidget;
		
		if (message.event !== "execute") {
			return;
		}
		
		nodeWidget = message.node;
		if (!nodeWidget) {
			return;
		}
		
		// helpStore is the jsId of the store, consult the HTML
		m.getHelpData(helpStore.getValue(nodeWidget.item, "sectionid"));
	}

	function _getANDTerms() {
		// summary: 
		//		TODO
		
		var query = [],
			andTerms = d.byId("searchInputAnds").value;
		
		if(andTerms) {
			andTerms = andTerms.split(" ");
			d.forEach(andTerms, function(term){
				query.push(" ", _escapeTerm(term));
			});		
		}
		return query.join("");	
	}
	
	function _getORTerms(){
		// summary:
		//		TODO
		
		var query = [],
			orTerms = d.byId("searchInputOrs").value;
		
		if(orTerms) {
			orTerms = orTerms.split(" ");
			d.forEach(orTerms, function(term){
				if(query.length === 0){
					query.push(" ", _escapeTerm(term));
				} else {
					query.push(" OR" + _escapeTerm(term));
				}
			});		
		}
		return query.join("");	
	}
	
	function _getNOTTerms(){
		var query = [],
			notTerms = d.byId("searchInputNots").value;
		
		if(notTerms) {
			notTerms = notTerms.split(" ");
			d.forEach(notTerms, function(term){
				query.push(" -", _escapeTerm(term));
			});		
		}
		return query.join("");	
	}
	
	function _getPhrase(){
		var phrase = d.byId("searchInputPhrase").value;
		
		if (phrase) {
			return ' "' + _escapeTerm(phrase) + '"';	
		}
		
		return "";
	}
	
	function _escapeTerm( /*String */ term){
		//  summary:
	    //        Escape the characters of a field against the Lucene query special characters.
		
		if(!term) {
			return "";
		}
		
		var specialChars = "+-&|!(){}[]^\"~*?:\\";
		d.forEach(term, function(c){ 
				if (specialChars.indexOf(c) !== -1) {
					term = term.replace(c, "\\" + c); 
				}
			}
	    );
		
		return term;
	}
	
	d.mixin(m, {
		getHelpData : function( /*String*/ sectionId) {
			// summary:
			//		Get the help section which the id is sectionId from database
			//		and display it.
			
			// TODO Loading messages shouldn"t be created and destroyed like this, will
			// be very slow in IE6/7. Should show/hide and existing element. Same for
			// notices
			
			var bodyInfo = d.position("body", true),
				loadingMessage = d.create("div", {id :"loading-message"},
									d.byId("GTPRootPortlet"), "first"),
				targetNode = d.byId("onlineHelpContent");
			
			// Hide notice messages
			d.query(_noticeSelector).forEach(function(notice){
				try{
					d.destroy(noticeMessage);
				} catch(e) {}
			});
			
			d.style(loadingMessage, {
					width:bodyInfo.w + "px", 
					height:bodyInfo.h + "px"
			});
			d.create("p", {innerHTML: onlineHelpLoadingMessage}, "loading-message");
			d.create("div", {id :"loadingProgressBar"}, "loading-message");
			
			//Look up the node that will be updated with the section content
			m.xhrPost( {
				url : m.getServletURL(
						"/screen/AjaxScreen/action/GetHelpSection?sectionid=" + sectionId),
				handleAs : "text",
				contentType: "text/html; charset=utf-8",
				load : function(response, args){
					targetNode.innerHTML = response;
					d.parser.parse(targetNode);
					d.byId("featureid").value = sectionId;
				    var loadingMessage = d.byId("loading-message");
					m.animate("fadeOut", loadingMessage, function(){
						d.destroy(loadingMessage);
					});
				}
			});
			console.debug("[m.help] Retrieved section with ID:" + sectionId);
		},
		
		editHelpData : function(/*String*/ option,
				   				/*String*/ id) {
			// summary:
			//		TODO
			
			document.location.href = 
				m.getServletURL("/screen/OnlineHelpScreen?option=" + option +
						"&operation=MODIFY_FEATURES&featureid="+ id);
		},
		
		deleteHelpData : function( /*String*/ option,
								   /*String*/ id,
								   /*String*/ token) {
			// summary:
			//		TODO
			
			var params = [
					{name:'option',value:option},
					{name:'operation',value:'DELETE_FEATURES'},
					{name:'featureid',value:id},
					{name:'token',value:token}
			];
			
			var deleteParams = {
					action : m.getServletURL("/screen/OnlineHelpScreen"),
					params: params
				};
			m.post(deleteParams);
		},
		
		initHelpTree : function() {
			d.subscribe("helpTree", _helpTreeHandler);
		},
		
		toggleHelpSearchMode : function() {
			var standardSearch = d.byId("standardSearchContainer"),
		    	advancedSearch = d.byId("advancedSearchContainer"),
		    	standardSearchDisplay = d.style(standardSearch, "display");
			
			if(standardSearch && (standardSearchDisplay === "block")){
				d.style(standardSearch, "display", "none");
				dj.byId("search").set("value","");
				d.style(advancedSearch, "display", "block");
			} else {
				d.style(standardSearch, "display", "block");
				dj.byId("searchInputAnds").set("value","");
				dj.byId("searchInputOrs").set("value","");
				dj.byId("searchInputPhrase").set("value","");
				dj.byId("searchInputNots").set("value","");
				d.style(advancedSearch, "display", "none");
			}
		},
		
		buildLuceneQuery : function() {
			var search = _getANDTerms() + _getORTerms() + _getNOTTerms() + _getPhrase();
			if (search) {
				d.byId("search").value = search;
				d.byId("helpSearchForm").submit();
			}
		}
	});
	
	d.subscribe("ready", function(){
		misys.initHelpTree();
	});
})(dojo, dijit, misys);