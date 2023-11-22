dojo.provide("misys.report.widget.Filter");
dojo.experimental("misys.report.widget.Filter"); 

dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.require("misys.layout.SingleItem");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.report.widget.Filter",
	[ dijit._Templated, misys.layout.SingleItem, misys.layout.SimpleItem ],
	// class properties:
	{
		templatePath: null,
		templateString: dojo.byId("filter-template").innerHTML,
		
		widgetsInTemplate: true,
		
		name: '',
		
		xmlTagName: 'filter',
		
		startup: function()
		{
			console.debug("[Filter] startup start");
			this.name = this.id;
			this.inherited(arguments);
			
			if (this.createdByUser)
			{
				var criteriaItem = new misys.report.widget.Criteria(
					{dialogAddItemTitle: misys.getLocalization('addCriterium'),
					 dialogUpdateItemTitle: misys.getLocalization('updateCriterium')},
					document.createElement("div"));
				dojo.place(criteriaItem.domNode, this.criteriaNode);
				criteriaItem.startup();
			}

			console.debug("[Filter] startup end");
		},
		
		// method over-ride
		buildRendering: function(){
			// summary:
			//		Construct the UI for this widget from a template, setting this.domNode.
			// tags:
			//		protected

			this._attachPoints = [];

			// Lookup cached version of template, and download to cache if it
			// isn't there already.  Returns either a DomNode or a string, depending on
			// whether or not the template contains ${foo} replacement parameters.
			var cached = dijit._Templated.getCachedTemplate(this.templatePath, this.templateString, this._skipNodeCache);
	
			var node;
			if(dojo.isString(cached)){
				node = dojo._toDom(this._stringRepl(cached));
				if(node.nodeType != 1){
					// Flag common problems such as templates with multiple top level nodes (nodeType == 11)
					throw new Error("Invalid template: " + cached);
				}
			}else{
				// if it's a node, all we have to do is clone it
				node = cached.cloneNode(true);
			}
	
			this.domNode = node;
	
			// recurse through the node, looking for, and attaching to, our
			// attachment points and events, which should be defined on the template node.
			this._attachTemplateNodes(node);
	
			if(this.widgetsInTemplate){
				// Make sure dojoType is used for parsing widgets in template.
				// The dojo.parser.query could be changed from multiversion support.
				var parser = dojo.parser, qry, attr;
				if(parser._query != "[dojoType]"){
					qry = parser._query;
					attr = parser._attrName;
					parser._query = "[dojoType]";
					parser._attrName = "dojoType";
				}
	
				// Store widgets that we need to start at a later point in time
				var cw = (this._startupWidgets = dojo.parser.parse(node, {
					noStart: !this._earlyTemplatedStartup
				}));
	
				// Restore the query.
				if(qry){
					parser._query = qry;
					parser._attrName = attr;
				}
	
				this._supportingWidgets = dijit.findWidgets(node);
	
				this._attachTemplateNodes(cw, function(n,p){
					return n[p];
				});
			}
		
			/*// Replace the above code  by this below
			this.inherited(arguments);*/
			this._fillContentNodes(dojo.query("[dojotype='misys.report.widget.Criteria']", this.srcNodeRef), this.criteriaNode);
		},

		_fillContentNodes: function(source, dest){
			// summary:
			//		Relocate source contents to templated container node.
			//		this.containerNode must be able to receive children, or exceptions will be thrown.
			// tags:
			//		protected
			//var dest = this.criteriaNode;
			if(source && source instanceof Array){
				source = source[0];
			}
			if(source && dest){
				//while(source.hasChildNodes()){
				//	dest.appendChild(source.firstChild);
				//}
				dest.appendChild(source);
			}
		},

		// Override inherited method
		getChildren: function(){
			// summary:
			//		Returns array of child widgets.
			// description:
			//		Returns the widgets that are directly under this.criteriaNode.
			return dojo.query("> [widgetId]", this.criteriaNode).map(dijit.byNode); // Widget[]
		},
		
		toXML: function(){
			var xmlString = ['<', this.xmlTagName, '>'];
			this.getChildren().forEach(function(child){
				xmlString.push(child.toXML());
			});
			xmlString.push('</', this.xmlTagName, '>');
			return xmlString.join('');
		}
	}
);