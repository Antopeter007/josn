dojo.provide("misys.widget.Tree");
dojo.experimental("misys.widget.Tree");
dojo.require("misys.common");
dojo.require("dijit.Tree");

dojo.declare(
	"misys.widget.Tree",
	[dijit.Tree],
	{
		onLoadId : 0,
		
		parentId : '',
		
		childId : '',
		
		rootIdTree : '',
		
		onLoad: function(){
			this.onLoadOpen();
		},
		
		onLoadOpen : function (){
			// summary:
			//		Translates click events into commands for the controller to process

			if(this.onLoadId > 0)
			{
				var nodeWidget = this._itemNodesMap[this.onLoadId];
				var domElement = nodeWidget[0].domNode;
				
				// expando node was clicked, or label of a folder node was clicked; open it
				if(nodeWidget[0].isExpandable){
					this._onExpandoClick({node:nodeWidget[0]});
				}
			}
			if(this.parentId !== null && this.parentId !== '')
			{
				var array = [];
				var childArray = [];
				childArray.push(this.rootIdTree);
				childArray.push(this.parentId);
				if(this.childId !== '0')
				{
					childArray.push(this.childId);
				}
				array.push(childArray);
				this.set("paths",array);
			}
		},
		
		onClick: function(/* dojo.data */ item, /*TreeNode*/ node, /*Event*/ evt){
			if(item.url) {
				document.location.href = item.url;
			} else {
				if(node.isExpanded){
					this._collapseNode(node);
				}else{
					this._expandNode(node);
				}
			}
		},
		
		
		_onClick: function(/*TreeNode*/ nodeWidget, /*Event*/ e){	
				
				var evt = e;
			//	var targetUrl =misys._getTargetUrl(evt);
				var targetUrl = nodeWidget.item.url;
				if(targetUrl !== "" && targetUrl!=undefined)
				{
					if(misys.isPopupRequired())					
					{
					dojo.stopEvent(evt);
					misys.showUnsavedDataDialog();
					var handle = dojo.connect(misys, "setUnsavedDataOption", function(){
						if(misys.unsavedDataOption !== 'notset')
						{
							var errorMsg = "";
							if(misys.unsavedDataOption == 'save')
							{
							//	errorMsg = _submitAsync("SAVE");
								misys.saveAsync(targetUrl);
								this.inherited(arguments);
							}
							else if(targetUrl !== "" && errorMsg === "" && misys.unsavedDataOption == 'nosave')
							{
								location.href = targetUrl;
								this.inherited(arguments);
							}
						}	
						dojo.disconnect(handle);
					});
				}
					else
						{
						this.inherited(arguments);
						}
			}
				else
					{
			this.inherited(arguments);
					}
		}
	}
);


