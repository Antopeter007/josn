dojo.provide("misys.grid._ViewManager");
dojo.require("dojox.grid._ViewManager");
dojo.declare("misys.grid._ViewManager",
		[ dojox.grid._ViewManager ],
{
		measureContent: function(){
			console.debug("[MTPViewManager] measureContent");
			var h = 0;
			this.forEach(function(inView){
				var actualHeight = 0;
				if (inView.contentNode.childNodes.length > 0)
				{
					actualHeight = inView.contentNode.childNodes[0].offsetHeight;
					console.debug("[MTPViewManager] h: " + h + "   actualHeight: " + actualHeight);
				}
				h = Math.max(actualHeight, h);
			});
			return h;
		}
});
