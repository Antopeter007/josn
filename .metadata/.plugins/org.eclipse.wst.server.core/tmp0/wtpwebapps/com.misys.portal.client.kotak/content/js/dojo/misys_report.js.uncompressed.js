/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

dojo.provide("misys.layer.report");
if(!dojo._hasResource["dojo.behavior"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.behavior"] = true;
dojo.provide("dojo.behavior");


dojo.behavior = new function(){
	// summary:
	//		Utility for unobtrusive/progressive event binding, DOM traversal,
	//		and manipulation.
	//
	// description:
	//
	//		A very simple, lightweight mechanism for applying code to
	//		existing documents, based around `dojo.query` (CSS3 selectors) for node selection,
	//		and a simple two-command API: `dojo.behavior.add()` and `dojo.behavior.apply()`;
	//
	//		Behaviors apply to a given page, and are registered following the syntax
	//		options described by `dojo.behavior.add` to match nodes to actions, or "behaviors".
	//
	//		Added behaviors are applied to the current DOM when .apply() is called,
	//		matching only new nodes found since .apply() was last called.
	//
	function arrIn(obj, name){
		if(!obj[name]){ obj[name] = []; }
		return obj[name];
	}

	var _inc = 0;

	function forIn(obj, scope, func){
		var tmpObj = {};
		for(var x in obj){
			if(typeof tmpObj[x] == "undefined"){
				if(!func){
					scope(obj[x], x);
				}else{
					func.call(scope, obj[x], x);
				}
			}
		}
	}

	// FIXME: need a better test so we don't exclude nightly Safari's!
	this._behaviors = {};
	this.add = function(/* Object */behaviorObj){
		//	summary:
		//		Add the specified behavior to the list of behaviors, ignoring existing
		//		matches.
		//
		//	description:
		//		Add the specified behavior to the list of behaviors which will
		//		be applied the next time apply() is called. Calls to add() for
		//		an already existing behavior do not replace the previous rules,
		//		but are instead additive. New nodes which match the rule will
		//		have all add()-ed behaviors applied to them when matched.
		//
		//		The "found" method is a generalized handler that's called as soon
		//		as the node matches the selector. Rules for values that follow also
		//		apply to the "found" key.
		//
		//		The "on*" handlers are attached with `dojo.connect()`, using the
		//		matching node
		//
		//		If the value corresponding to the ID key is a function and not a
		//		list, it's treated as though it was the value of "found".
		//
		// 		dojo.behavior.add() can be called any number of times before
		//		the DOM is ready. `dojo.behavior.apply()` is called automatically
		//		by `dojo.addOnLoad`, though can be called to re-apply previously added
		//		behaviors anytime the DOM changes.
		//
		//		There are a variety of formats permitted in the behaviorObject
		//
		//	example:
		//		Simple list of properties. "found" is special. "Found" is assumed if
		//		no property object for a given selector, and property is a function.
		//
		//	|	dojo.behavior.add({
		//	|		"#id": {
		//	|			"found": function(element){
		//	|				// node match found
		//	|			},
		//	|			"onclick": function(evt){
		//	|				// register onclick handler for found node
		//	|			}
		//	|		},
		// 	|		"#otherid": function(element){
		//	|			// assumes "found" with this syntax
		//	|		}
		//	|	});
		//
		//	example:
		//		 If property is a string, a dojo.publish will be issued on the channel:
		//
		//	|	dojo.behavior.add({
		//	|		// dojo.publish() whenever class="noclick" found on anchors
		//	|		"a.noclick": "/got/newAnchor",
		//	|		"div.wrapper": {
		//	|			"onclick": "/node/wasClicked"
		//	|		}
		//	|	});
		//	|	dojo.subscribe("/got/newAnchor", function(node){
		//	|		// handle node finding when dojo.behavior.apply() is called,
		//	|		// provided a newly matched node is found.
		//	|	});
		//
		//	example:
		//		Scoping can be accomplished by passing an object as a property to
		//		a connection handle (on*):
		//
		//	|	dojo.behavior.add({
		//	|		 	"#id": {
		//	|				// like calling dojo.hitch(foo,"bar"). execute foo.bar() in scope of foo
		//	|				"onmouseenter": { targetObj: foo, targetFunc: "bar" },
		//	|				"onmouseleave": { targetObj: foo, targetFunc: "baz" }
		//	|			}
		//	|	});
		//
		//	example:
		//		Bahaviors match on CSS3 Selectors, powered by dojo.query. Example selectors:
		//
		//	|	dojo.behavior.add({
		//	|		// match all direct descendants
		//	|		"#id4 > *": function(element){
		//	|			// ...
		//	|		},
		//	|
		//	|		// match the first child node that's an element
		//	|		"#id4 > :first-child": { ... },
		//	|
		//	|		// match the last child node that's an element
		//	|		"#id4 > :last-child":  { ... },
		//	|
		//	|		// all elements of type tagname
		//	|		"tagname": {
		//	|			// ...
		//	|		},
		//	|
		//	|		"tagname1 tagname2 tagname3": {
		//	|			// ...
		//	|		},
		//	|
		//	|		".classname": {
		//	|			// ...
		//	|		},
		//	|
		//	|		"tagname.classname": {
		//	|			// ...
		//	|		}
		//	|	});
		//

		var tmpObj = {};
		forIn(behaviorObj, this, function(behavior, name){
			var tBehavior = arrIn(this._behaviors, name);
			if(typeof tBehavior["id"] != "number"){
				tBehavior.id = _inc++;
			}
			var cversion = [];
			tBehavior.push(cversion);
			if((dojo.isString(behavior))||(dojo.isFunction(behavior))){
				behavior = { found: behavior };
			}
			forIn(behavior, function(rule, ruleName){
				arrIn(cversion, ruleName).push(rule);
			});
		});
	};

	var _applyToNode = function(node, action, ruleSetName){
		if(dojo.isString(action)){
			if(ruleSetName == "found"){
				dojo.publish(action, [ node ]);
			}else{
				dojo.connect(node, ruleSetName, function(){
					dojo.publish(action, arguments);
				});
			}
		}else if(dojo.isFunction(action)){
			if(ruleSetName == "found"){
				action(node);
			}else{
				dojo.connect(node, ruleSetName, action);
			}
		}
	};

	this.apply = function(){
		// summary:
		//		Applies all currently registered behaviors to the document.
		//
		// description:
		//		Applies all currently registered behaviors to the document,
		//		taking care to ensure that only incremental updates are made
		//		since the last time add() or apply() were called.
		//
		//		If new matching nodes have been added, all rules in a behavior will be
		//		applied to that node. For previously matched nodes, only
		//		behaviors which have been added since the last call to apply()
		//		will be added to the nodes.
		//
		//		apply() is called once automatically by `dojo.addOnLoad`, so
		//		registering behaviors with `dojo.behavior.add` before the DOM is
		//		ready is acceptable, provided the dojo.behavior module is ready.
		//
		//		Calling appy() manually after manipulating the DOM is required
		//		to rescan the DOM and apply newly .add()ed behaviors, or to match
		//		nodes that match existing behaviors when those nodes are added to
		//		the DOM.
		//
		forIn(this._behaviors, function(tBehavior, id){
			dojo.query(id).forEach(
				function(elem){
					var runFrom = 0;
					var bid = "_dj_behavior_"+tBehavior.id;
					if(typeof elem[bid] == "number"){
						runFrom = elem[bid];
						if(runFrom == (tBehavior.length)){
							return;
						}
					}
					// run through the versions, applying newer rules at each step

					for(var x=runFrom, tver; tver = tBehavior[x]; x++){
						forIn(tver, function(ruleSet, ruleSetName){
							if(dojo.isArray(ruleSet)){
								dojo.forEach(ruleSet, function(action){
									_applyToNode(elem, action, ruleSetName);
								});
							}
						});
					}

					// ensure that re-application only adds new rules to the node
					elem[bid] = tBehavior.length;
				}
			);
		});
	};
};

dojo.addOnLoad(dojo.behavior, "apply");

}

if(!dojo._hasResource["dijit.layout.BorderContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.BorderContainer"] = true;
dojo.provide("dijit.layout.BorderContainer");





dojo.declare(
	"dijit.layout.BorderContainer",
	dijit.layout._LayoutWidget,
{
	// summary:
	//		Provides layout in up to 5 regions, a mandatory center with optional borders along its 4 sides.
	//
	// description:
	//		A BorderContainer is a box with a specified size, such as style="width: 500px; height: 500px;",
	//		that contains a child widget marked region="center" and optionally children widgets marked
	//		region equal to "top", "bottom", "leading", "trailing", "left" or "right".
	//		Children along the edges will be laid out according to width or height dimensions and may
	//		include optional splitters (splitter="true") to make them resizable by the user.  The remaining
	//		space is designated for the center region.
	//
	//		The outer size must be specified on the BorderContainer node.  Width must be specified for the sides
	//		and height for the top and bottom, respectively.  No dimensions should be specified on the center;
	//		it will fill the remaining space.  Regions named "leading" and "trailing" may be used just like
	//		"left" and "right" except that they will be reversed in right-to-left environments.
	//
	//		For complex layouts, multiple children can be specified for a single region.   In this case, the
	//		layoutPriority flag on the children determines which child is closer to the edge (low layoutPriority)
	//		and which child is closer to the center (high layoutPriority).   layoutPriority can also be used
	//		instead of the design attribute to conrol layout precedence of horizontal vs. vertical panes.
	// example:
	// |	<div dojoType="dijit.layout.BorderContainer" design="sidebar" gutters="false"
	// |            style="width: 400px; height: 300px;">
	// |		<div dojoType="dijit.layout.ContentPane" region="top">header text</div>
	// |		<div dojoType="dijit.layout.ContentPane" region="right" splitter="true" style="width: 200px;">table of contents</div>
	// |		<div dojoType="dijit.layout.ContentPane" region="center">client area</div>
	// |	</div>

	// design: String
	//		Which design is used for the layout:
	//			- "headline" (default) where the top and bottom extend
	//				the full width of the container
	//			- "sidebar" where the left and right sides extend from top to bottom.
	design: "headline",

	// gutters: [const] Boolean
	//		Give each pane a border and margin.
	//		Margin determined by domNode.paddingLeft.
	//		When false, only resizable panes have a gutter (i.e. draggable splitter) for resizing.
	gutters: true,

	// liveSplitters: [const] Boolean
	//		Specifies whether splitters resize as you drag (true) or only upon mouseup (false)
	liveSplitters: true,

	// persist: Boolean
	//		Save splitter positions in a cookie.
	persist: false,

	baseClass: "dijitBorderContainer",

	// _splitterClass: String
	// 		Optional hook to override the default Splitter widget used by BorderContainer
	_splitterClass: "dijit.layout._Splitter",

	postMixInProperties: function(){
		// change class name to indicate that BorderContainer is being used purely for
		// layout (like LayoutContainer) rather than for pretty formatting.
		if(!this.gutters){
			this.baseClass += "NoGutter";
		}
		this.inherited(arguments);
	},

	startup: function(){
		if(this._started){ return; }
		dojo.forEach(this.getChildren(), this._setupChild, this);
		this.inherited(arguments);
	},

	_setupChild: function(/*dijit._Widget*/ child){
		// Override _LayoutWidget._setupChild().

		var region = child.region;
		if(region){
			this.inherited(arguments);

			dojo.addClass(child.domNode, this.baseClass+"Pane");

			var ltr = this.isLeftToRight();
			if(region == "leading"){ region = ltr ? "left" : "right"; }
			if(region == "trailing"){ region = ltr ? "right" : "left"; }

			// Create draggable splitter for resizing pane,
			// or alternately if splitter=false but BorderContainer.gutters=true then
			// insert dummy div just for spacing
			if(region != "center" && (child.splitter || this.gutters) && !child._splitterWidget){
				var _Splitter = dojo.getObject(child.splitter ? this._splitterClass : "dijit.layout._Gutter");
				var splitter = new _Splitter({
					id: child.id + "_splitter",
					container: this,
					child: child,
					region: region,
					live: this.liveSplitters
				});
				splitter.isSplitter = true;
				child._splitterWidget = splitter;

				dojo.place(splitter.domNode, child.domNode, "after");

				// Splitters aren't added as Contained children, so we need to call startup explicitly
				splitter.startup();
			}
			child.region = region;	// TODO: technically wrong since it overwrites "trailing" with "left" etc.
		}
	},

	layout: function(){
		// Implement _LayoutWidget.layout() virtual method.
		this._layoutChildren();
	},

	addChild: function(/*dijit._Widget*/ child, /*Integer?*/ insertIndex){
		// Override _LayoutWidget.addChild().
		this.inherited(arguments);
		if(this._started){
			this.layout(); //OPT
		}
	},

	removeChild: function(/*dijit._Widget*/ child){
		// Override _LayoutWidget.removeChild().

		var region = child.region;
		var splitter = child._splitterWidget
		if(splitter){
			splitter.destroy();
			delete child._splitterWidget;
		}
		this.inherited(arguments);
		
		if(this._started){
			this._layoutChildren();
		}
		// Clean up whatever style changes we made to the child pane.
		// Unclear how height and width should be handled.
		dojo.removeClass(child.domNode, this.baseClass+"Pane");
		dojo.style(child.domNode, {
			top: "auto",
			bottom: "auto",
			left: "auto",
			right: "auto",
			position: "static"
		});
		dojo.style(child.domNode, region == "top" || region == "bottom" ? "width" : "height", "auto");
	},

	getChildren: function(){
		// Override _LayoutWidget.getChildren() to only return real children, not the splitters.
		return dojo.filter(this.inherited(arguments), function(widget){
			return !widget.isSplitter;
		});
	},

	// TODO: remove in 2.0
	getSplitter: function(/*String*/region){
		// summary:
		//		Returns the widget responsible for rendering the splitter associated with region
		// tags:
		//		deprecated
		return dojo.filter(this.getChildren(), function(child){
			return child.region == region;
		})[0]._splitterWidget;
	},

	resize: function(newSize, currentSize){
		// Overrides _LayoutWidget.resize().

		// resetting potential padding to 0px to provide support for 100% width/height + padding
		// TODO: this hack doesn't respect the box model and is a temporary fix
		if(!this.cs || !this.pe){
			var node = this.domNode;
			this.cs = dojo.getComputedStyle(node);
			this.pe = dojo._getPadExtents(node, this.cs);
			this.pe.r = dojo._toPixelValue(node, this.cs.paddingRight);
			this.pe.b = dojo._toPixelValue(node, this.cs.paddingBottom);

			dojo.style(node, "padding", "0px");
		}

		this.inherited(arguments);
	},

	_layoutChildren: function(/*String?*/ changedChildId, /*Number?*/ changedChildSize){
		// summary:
		//		This is the main routine for setting size/position of each child.
		// description:
		//		With no arguments, measures the height of top/bottom panes, the width
		//		of left/right panes, and then sizes all panes accordingly.
		//
		//		With changedRegion specified (as "left", "top", "bottom", or "right"),
		//		it changes that region's width/height to changedRegionSize and
		//		then resizes other regions that were affected.
		// changedChildId:
		//		Id of the child which should be resized because splitter was dragged.
		// changedChildSize:
		//		The new width/height (in pixels) to make specified child

		if(!this._borderBox || !this._borderBox.h){
			// We are currently hidden, or we haven't been sized by our parent yet.
			// Abort.   Someone will resize us later.
			return;
		}

		// Generate list of wrappers of my children in the order that I want layoutChildren()
		// to process them (i.e. from the outside to the inside)
		var wrappers = dojo.map(this.getChildren(), function(child, idx){
			return {
				pane: child,
				weight: [
					child.region == "center" ? Infinity : 0,
					child.layoutPriority,
					(this.design == "sidebar" ? 1 : -1) * (/top|bottom/.test(child.region) ? 1 : -1),
					idx
				]
			};
		}, this);
		wrappers.sort(function(a, b){
			var aw = a.weight, bw = b.weight;
			for(var i=0; i<aw.length; i++){
				if(aw[i] != bw[i]){
					return aw[i] - bw[i];
				}
			}
			return 0;
		});

		// Make new list, combining the externally specified children with splitters and gutters
		var childrenAndSplitters = [];
		dojo.forEach(wrappers, function(wrapper){
			var pane = wrapper.pane;
			childrenAndSplitters.push(pane);
			if(pane._splitterWidget){
				childrenAndSplitters.push(pane._splitterWidget);
			}
		});

		// Compute the box in which to lay out my children
		var dim = {
			l: this.pe.l,
			t: this.pe.t,
			w: this._borderBox.w - this.pe.w,
			h: this._borderBox.h - this.pe.h
		};

		// Layout the children, possibly changing size due to a splitter drag
		dijit.layout.layoutChildren(this.domNode, dim, childrenAndSplitters,
			changedChildId, changedChildSize);
	},

	destroyRecursive: function(){
		// Destroy splitters first, while getChildren() still works
		dojo.forEach(this.getChildren(), function(child){
			var splitter = child._splitterWidget;
			if(splitter){
				splitter.destroy();
			}
			delete child._splitterWidget;
		});

		// Then destroy the real children, and myself
		this.inherited(arguments);
	}
});

// This argument can be specified for the children of a BorderContainer.
// Since any widget can be specified as a LayoutContainer child, mix it
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget, {
	// region: [const] String
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Values: "top", "bottom", "leading", "trailing", "left", "right", "center".
	//		See the `dijit.layout.BorderContainer` description for details.
	region: '',

	// layoutPriority: [const] Number
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Children with a higher layoutPriority will be placed closer to the BorderContainer center,
	//		between children with a lower layoutPriority.
	layoutPriority: 0,

	// splitter: [const] Boolean
	//		Parameter for child of `dijit.layout.BorderContainer` where region != "center".
	//		If true, enables user to resize the widget by putting a draggable splitter between
	//		this widget and the region=center widget.
	splitter: false,

	// minSize: [const] Number
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Specifies a minimum size (in pixels) for this widget when resized by a splitter.
	minSize: 0,

	// maxSize: [const] Number
	//		Parameter for children of `dijit.layout.BorderContainer`.
	//		Specifies a maximum size (in pixels) for this widget when resized by a splitter.
	maxSize: Infinity
});

dojo.declare("dijit.layout._Splitter", [ dijit._Widget, dijit._Templated ],
{
	// summary:
	//		A draggable spacer between two items in a `dijit.layout.BorderContainer`.
	// description:
	//		This is instantiated by `dijit.layout.BorderContainer`.  Users should not
	//		create it directly.
	// tags:
	//		private

/*=====
 	// container: [const] dijit.layout.BorderContainer
 	//		Pointer to the parent BorderContainer
	container: null,

	// child: [const] dijit.layout._LayoutWidget
	//		Pointer to the pane associated with this splitter
	child: null,

	// region: [const] String
	//		Region of pane associated with this splitter.
	//		"top", "bottom", "left", "right".
	region: null,
=====*/

	// live: [const] Boolean
	//		If true, the child's size changes and the child widget is redrawn as you drag the splitter;
	//		otherwise, the size doesn't change until you drop the splitter (by mouse-up)
	live: true,

	templateString: '<div class="dijitSplitter" dojoAttachEvent="onkeypress:_onKeyPress,onmousedown:_startDrag,onmouseenter:_onMouse,onmouseleave:_onMouse" tabIndex="0" role="separator"><div class="dijitSplitterThumb"></div></div>',

	postMixInProperties: function(){
		this.inherited(arguments);

		this.horizontal = /top|bottom/.test(this.region);
		this._factor = /top|left/.test(this.region) ? 1 : -1;
		this._cookieName = this.container.id + "_" + this.region;
	},

	buildRendering: function(){
		this.inherited(arguments);

		dojo.addClass(this.domNode, "dijitSplitter" + (this.horizontal ? "H" : "V"));

		if(this.container.persist){
			// restore old size
			var persistSize = dojo.cookie(this._cookieName);
			if(persistSize){
				this.child.domNode.style[this.horizontal ? "height" : "width"] = persistSize;
			}
		}
	},

	_computeMaxSize: function(){
		// summary:
		//		Return the maximum size that my corresponding pane can be set to

		var dim = this.horizontal ? 'h' : 'w',
			childSize = dojo.marginBox(this.child.domNode)[dim],
			center = dojo.filter(this.container.getChildren(), function(child){ return child.region == "center";})[0],
			spaceAvailable = dojo.marginBox(center.domNode)[dim];	// can expand until center is crushed to 0

		return Math.min(this.child.maxSize, childSize + spaceAvailable);
	},

	_startDrag: function(e){
		if(!this.cover){
			this.cover = dojo.doc.createElement('div');
			dojo.addClass(this.cover, "dijitSplitterCover");
			dojo.place(this.cover, this.child.domNode, "after");
		}
		dojo.addClass(this.cover, "dijitSplitterCoverActive");

		// Safeguard in case the stop event was missed.  Shouldn't be necessary if we always get the mouse up.
		if(this.fake){ dojo.destroy(this.fake); }
		if(!(this._resize = this.live)){ //TODO: disable live for IE6?
			// create fake splitter to display at old position while we drag
			(this.fake = this.domNode.cloneNode(true)).removeAttribute("id");
			dojo.addClass(this.domNode, "dijitSplitterShadow");
			dojo.place(this.fake, this.domNode, "after");
		}
		dojo.addClass(this.domNode, "dijitSplitterActive dijitSplitter" + (this.horizontal ? "H" : "V") + "Active");
		if(this.fake){
			dojo.removeClass(this.fake, "dijitSplitterHover dijitSplitter" + (this.horizontal ? "H" : "V") + "Hover");
		}

		//Performance: load data info local vars for onmousevent function closure
		var factor = this._factor,
			isHorizontal = this.horizontal,
			axis = isHorizontal ? "pageY" : "pageX",
			pageStart = e[axis],
			splitterStyle = this.domNode.style,
			dim = isHorizontal ? 'h' : 'w',
			childStart = dojo.marginBox(this.child.domNode)[dim],
			max = this._computeMaxSize(),
			min = this.child.minSize || 20,
			region = this.region,
			splitterAttr = region == "top" || region == "bottom" ? "top" : "left",	// style attribute of splitter to adjust
			splitterStart = parseInt(splitterStyle[splitterAttr], 10),
			resize = this._resize,
			layoutFunc = dojo.hitch(this.container, "_layoutChildren", this.child.id),
			de = dojo.doc;

		this._handlers = (this._handlers || []).concat([
			dojo.connect(de, "onmousemove", this._drag = function(e, forceResize){
				var delta = e[axis] - pageStart,
					childSize = factor * delta + childStart,
					boundChildSize = Math.max(Math.min(childSize, max), min);

				if(resize || forceResize){
					layoutFunc(boundChildSize);
				}
				// TODO: setting style directly (usually) sets content box size, need to set margin box size
				splitterStyle[splitterAttr] = delta + splitterStart + factor*(boundChildSize - childSize) + "px";
			}),
			dojo.connect(de, "ondragstart", dojo.stopEvent),
			dojo.connect(dojo.body(), "onselectstart", dojo.stopEvent),
			dojo.connect(de, "onmouseup", this, "_stopDrag")
		]);
		dojo.stopEvent(e);
	},

	_onMouse: function(e){
		var o = (e.type == "mouseover" || e.type == "mouseenter");
		dojo.toggleClass(this.domNode, "dijitSplitterHover", o);
		dojo.toggleClass(this.domNode, "dijitSplitter" + (this.horizontal ? "H" : "V") + "Hover", o);
	},

	_stopDrag: function(e){
		try{
			if(this.cover){
				dojo.removeClass(this.cover, "dijitSplitterCoverActive");
			}
			if(this.fake){ dojo.destroy(this.fake); }
			dojo.removeClass(this.domNode, "dijitSplitterActive dijitSplitter"
				+ (this.horizontal ? "H" : "V") + "Active dijitSplitterShadow");
			this._drag(e); //TODO: redundant with onmousemove?
			this._drag(e, true);
		}finally{
			this._cleanupHandlers();
			delete this._drag;
		}

		if(this.container.persist){
			dojo.cookie(this._cookieName, this.child.domNode.style[this.horizontal ? "height" : "width"], {expires:365});
		}
	},

	_cleanupHandlers: function(){
		dojo.forEach(this._handlers, dojo.disconnect);
		delete this._handlers;
	},

	_onKeyPress: function(/*Event*/ e){
		// should we apply typematic to this?
		this._resize = true;
		var horizontal = this.horizontal;
		var tick = 1;
		var dk = dojo.keys;
		switch(e.charOrCode){
			case horizontal ? dk.UP_ARROW : dk.LEFT_ARROW:
				tick *= -1;
//				break;
			case horizontal ? dk.DOWN_ARROW : dk.RIGHT_ARROW:
				break;
			default:
//				this.inherited(arguments);
				return;
		}
		var childSize = dojo._getMarginSize(this.child.domNode)[ horizontal ? 'h' : 'w' ] + this._factor * tick;
		this.container._layoutChildren(this.child.id, Math.max(Math.min(childSize, this._computeMaxSize()), this.child.minSize));
		dojo.stopEvent(e);
	},

	destroy: function(){
		this._cleanupHandlers();
		delete this.child;
		delete this.container;
		delete this.cover;
		delete this.fake;
		this.inherited(arguments);
	}
});

dojo.declare("dijit.layout._Gutter", [dijit._Widget, dijit._Templated],
{
	// summary:
	// 		Just a spacer div to separate side pane from center pane.
	//		Basically a trick to lookup the gutter/splitter width from the theme.
	// description:
	//		Instantiated by `dijit.layout.BorderContainer`.  Users should not
	//		create directly.
	// tags:
	//		private

	templateString: '<div class="dijitGutter" role="presentation"></div>',

	postMixInProperties: function(){
		this.inherited(arguments);
		this.horizontal = /top|bottom/.test(this.region);
	},

	buildRendering: function(){
		this.inherited(arguments);
		dojo.addClass(this.domNode, "dijitGutter" + (this.horizontal ? "H" : "V"));
	}
});

}

if(!dojo._hasResource["misys.report.definitions.report_all_candidates"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["misys.report.definitions.report_all_candidates"] = true;
dojo.provide("misys.report.definitions.report_all_candidates");
 
		// Copyright (c) 2000-2004 NEOMAlogic (http://www.neomalogic.com),
		// All Rights Reserved. 
	
		//
		// All master candidates
		//
		

		arrProductColumn["AllMaster"][0] = "ref_id";
		arrProductColumn["AllMaster"][1] = "template_id";
		arrProductColumn["AllMaster"][2] = "bo_ref_id";
		arrProductColumn["AllMaster"][3] = "cust_ref_id";
		arrProductColumn["AllMaster"][4] = "prod_stat_code";
		arrProductColumn["AllMaster"][5] = "appl_date";
		arrProductColumn["AllMaster"][6] = "iss_date";
		arrProductColumn["AllMaster"][7] = "cur_code";
		arrProductColumn["AllMaster"][8] = "amt";
		arrProductColumn["AllMaster"][9] = "liab_amt";
		arrProductColumn["AllMaster"][10] = "entity";
		arrProductColumn["AllMaster"][11] = "product_code";
		arrProductColumn["AllMaster"][12] = "customer_name";
		arrProductColumn["AllMaster"][13] = "customer_address_line_1";
		arrProductColumn["AllMaster"][14] = "customer_address_line_2";
		arrProductColumn["AllMaster"][15] = "customer_dom";
		arrProductColumn["AllMaster"][16] = "customer_reference";
		arrProductColumn["AllMaster"][17] = "counterparty_name";
		arrProductColumn["AllMaster"][18] = "counterparty_address_line_1";
		arrProductColumn["AllMaster"][19] = "counterparty_address_line_2";
		arrProductColumn["AllMaster"][20] = "counterparty_dom";
		arrProductColumn["AllMaster"][21] = "counterparty_reference";
		arrProductColumn["AllMaster"][22] = "MainBank@name";
		arrProductColumn["AllMaster"][23] = "MainBank@address_line_1";
		arrProductColumn["AllMaster"][24] = "MainBank@address_line_2";
		arrProductColumn["AllMaster"][25] = "MainBank@dom";
		arrProductColumn["AllMaster"][26] = "Charge@chrg_code";
		arrProductColumn["AllMaster"][27] = "Charge@amt";
		arrProductColumn["AllMaster"][28] = "Charge@cur_code";
		arrProductColumn["AllMaster"][29] = "Charge@status";
		arrProductColumn["AllMaster"][30] = "Charge@additional_comment";
		arrProductColumn["AllMaster"][31] = "Charge@settlement_date";
		arrProductColumn["AllMaster"][32] = "Charge@chrg_type";
		arrProductColumn["AllMaster"][33] = "sub_product_code";

		//
		// All transaction candidates
		//
		

		arrProductColumn["AllTnx"][0] = "ref_id";
		arrProductColumn["AllTnx"][1] = "template_id";
		arrProductColumn["AllTnx"][2] = "bo_ref_id";
		arrProductColumn["AllTnx"][3] = "cust_ref_id";
		arrProductColumn["AllTnx"][4] = "tnx_type_code";
		arrProductColumn["AllTnx"][5] = "sub_tnx_type_code";
		arrProductColumn["AllTnx"][6] = "prod_stat_code";
		arrProductColumn["AllTnx"][7] = "tnx_val_date";
		arrProductColumn["AllTnx"][8] = "tnx_amt";
		arrProductColumn["AllTnx"][9] = "tnx_cur_code";
		arrProductColumn["AllTnx"][10] = "tnx_stat_code";
		arrProductColumn["AllTnx"][11] = "appl_date";
		arrProductColumn["AllTnx"][12] = "iss_date";
		arrProductColumn["AllTnx"][13] = "cur_code";
		arrProductColumn["AllTnx"][14] = "amt";
		arrProductColumn["AllTnx"][15] = "liab_amt";
		arrProductColumn["AllTnx"][16] = "entity";
		arrProductColumn["AllTnx"][17] = "product_code";
		arrProductColumn["AllTnx"][18] = "customer_name";
		arrProductColumn["AllTnx"][19] = "customer_address_line_1";
		arrProductColumn["AllTnx"][20] = "customer_address_line_2";
		arrProductColumn["AllTnx"][21] = "customer_dom";
		arrProductColumn["AllTnx"][22] = "customer_reference";
		arrProductColumn["AllTnx"][23] = "counterparty_name";
		arrProductColumn["AllTnx"][24] = "counterparty_address_line_1";
		arrProductColumn["AllTnx"][25] = "counterparty_address_line_2";
		arrProductColumn["AllTnx"][26] = "counterparty_dom";
		arrProductColumn["AllTnx"][27] = "counterparty_reference";
		arrProductColumn["AllTnx"][28] = "principal_act_no";
		arrProductColumn["AllTnx"][29] = "fee_act_no";
		arrProductColumn["AllTnx"][30] = "MainBank@name";
		arrProductColumn["AllTnx"][31] = "MainBank@address_line_1";
		arrProductColumn["AllTnx"][32] = "MainBank@address_line_2";
		arrProductColumn["AllTnx"][33] = "MainBank@dom";
		/*arrProductColumn["AllTnx"][34] = "Narrative@boComment";
		arrProductColumn["AllTnx"][35] = "Narrative@freeFormatText";
		*/arrProductColumn["AllTnx"][36] = "Inputter@last_name";
		arrProductColumn["AllTnx"][37] = "Inputter@first_name";
		arrProductColumn["AllTnx"][38] = "inp_dttm";
		/*arrProductColumn["AllTnx"][39] = "Controller@last_name";
		arrProductColumn["AllTnx"][40] = "Controller@first_name";*/
		arrProductColumn["AllTnx"][41] = "LastController@validation_dttm";
		arrProductColumn["AllTnx"][42] = "Releaser@last_name";
		arrProductColumn["AllTnx"][43] = "Releaser@first_name";
		arrProductColumn["AllTnx"][44] = "release_dttm";
		arrProductColumn["AllTnx"][45] = "Charge@chrg_code";
		arrProductColumn["AllTnx"][46] = "Charge@amt";
		arrProductColumn["AllTnx"][47] = "Charge@cur_code";
		arrProductColumn["AllTnx"][48] = "Charge@status";
		arrProductColumn["AllTnx"][49] = "Charge@additional_comment";
		arrProductColumn["AllTnx"][50] = "Charge@settlement_date";
		
		arrProductColumn["AllTnx"][51] = "bo_release_dttm";
		arrProductColumn["AllTnx"][52] = "sub_product_code";
		arrProductColumn["AllTnx"][53] = "bo_tnx_id";
		arrProductColumn["AllTnx"][54] = "company_name";
		arrProductColumn["AllTnx"][57] = "BOReleaser@last_name";
		arrProductColumn["AllTnx"][55] = "BOInputter@last_name";
		arrProductColumn["AllTnx"][56] = "BOInputter@first_name";
		arrProductColumn["AllTnx"][58] = "BOReleaser@first_name";
		arrProductColumn["AllTnx"][59] = "bo_inp_dttm";
		arrProductColumn["AllTnx"][61] = "LastController@LastControllerUser@first_name";
		arrProductColumn["AllTnx"][62] = "LastController@LastControllerUser@last_name";
		//
		// All template candidates
		//
		

		arrProductColumn["AllTemplate"][1] = "template_id";
		arrProductColumn["AllTemplate"][2] = "template_description";
		arrProductColumn["AllTemplate"][3] = "iss_date";
		arrProductColumn["AllTemplate"][4] = "customer_name";
		arrProductColumn["AllTemplate"][5] = "customer_address_line_1";
		arrProductColumn["AllTemplate"][6] = "customer_address_line_2";
		arrProductColumn["AllTemplate"][7] = "customer_dom";
		arrProductColumn["AllTemplate"][8] = "customer_reference";
		arrProductColumn["AllTemplate"][9] = "counterparty_name";
		arrProductColumn["AllTemplate"][10] = "counterparty_address_line_1";
		arrProductColumn["AllTemplate"][11] = "counterparty_address_line_2";
		arrProductColumn["AllTemplate"][12] = "counterparty_dom";
		arrProductColumn["AllTemplate"][13] = "counterparty_reference";
		arrProductColumn["AllTemplate"][14] = "MainBank@name";
		arrProductColumn["AllTemplate"][15] = "MainBank@address_line_1";
		arrProductColumn["AllTemplate"][16] = "MainBank@address_line_2";
		arrProductColumn["AllTemplate"][17] = "MainBank@dom";
		
		//
		// Definition of computation
		//
		arrComputation = [];
		arrComputation["+"] = "sum";
		arrComputation["-"] = "subtract";
		arrComputation["*"] = "multiplication";
		arrComputation["/"] = "division";
		
		
		// TODO: add the following entries at the right place, let in comment until field not added in screens
		//arrProductColumn["AllTemplate"][20] = "counterparty_country";
		
		//arrProductColumn["AllTnx"][60] = "counterparty_country";
		
		//arrProductColumn["AllMaster"][40] = "counterparty_country";
		
		
	

}

if(!dojo._hasResource['misys.client.report.common_client']){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource['misys.client.report.common_client'] = true;
dojo.provide('misys.client.report.common_client');
(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
'use strict'; // ECMA5 Strict Mode

// binding should be with the name 'reportclient'

})(dojo, dijit, misys);

}

if(!dojo._hasResource["misys.report.common"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["misys.report.common"] = true;
dojo.provide("misys.report.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	 // ECMA5 Strict Mode
	var arrColmn=' in arrColumn';
	var allAggregates='overall-aggregates';
	var groupAggregates='group-aggregates';
	var chartAggregates='chart-aggregates';
	var colmnGrid="columns-grid";
	var chartField='chart-fields';
	
	// Private functions & variables go here
	m._config = m._config || {};
    d.mixin(m._config, {
      isValid : false
    });
    
	d.mixin(m, {
	// Public functions & variables go here
		
		  arrComputedFieldIds : [],

		  getProductDecode : function(value) {
			  return arrCandidateName[value];
		  },
		  
		  getColumnDecode : function(value) {
			  return arrColumn[value][1];
		  },
		  
		  getDisplayedColumn : function(rowIndex, item) {
			  if(item) {
				  console.debug('item.computed_field_id: [' + item.computed_field_id + ']');
				  console.debug('computedLabel: [' + m.getLocalization('computedLabel') + ']');
				  var computedFieldId = d.isArray(item.computed_field_id) ? item.computed_field_id[0] : item.computed_field_id;
				  if(computedFieldId !== '') {
					  return m.getLocalization('computedLabel');
				  }
				
				  var column = d.isArray(item.column) ? item.column[0] : item.column;
				  return m.getColumnDecode(column);
			  }
			},
		  
		  getDisplayedColumnLabel : function(rowIndex, item) {
			  if(item) {
				  if(item.computed_field_id != '') {
					  return item.computed_field_id;
				  }
				  
				  return item['label_' + language];
			  }
		  },
		  
		  loadProductColumns : function() {
		  	var productCode = this.get('value').toLowerCase();
			  if(misys.reportclient && misys.reportclient.loadProductColumns)
			  {
				  misys.reportclient.loadProductColumns(productCode); 
			  }	
			  else
		      {
				  
				  try {
					  if(productCode.indexOf('tnx') != -1) {
						  productCode = productCode.substring(0, productCode.indexOf('tnx'));
					  }
					  if(productCode.indexOf('template') != -1) {
						  productCode = productCode.substring(0, productCode.indexOf('template')) + "_template";
					  }
					  
					  // Requires must be done like this, otherwise it breaks the Dojo build process
					 if(dj.byId("isSwift2019Enabled").get("value") && (productCode === 'bg' || productCode === 'bg_template' || productCode === 'br'))
					{
					  if(productCode === 'bg') {
						  dojo['require']('misys.report.definitions.report_iu_candidate');
					  } else if(productCode === 'bg_template') {
						  dojo['require']('misys.report.definitions.report_iu_template_candidate');
					  }
					  else if (productCode === 'br'){
						  dojo['require']('misys.report.definitions.report_ru_candidate');
					  }
					} 
					 else {
						// Requires must be done like this, otherwise it breaks the Dojo build process
						dojo['require']('misys.report.definitions.report_'+productCode+'_candidate');
					}
					  console.debug('CODE = ' + productCode);
					  initialiseProductArrays(productCode);
				  } 
				  catch(e)
				  {}
		      }		  
		  },
		  
		/**
		 * <h4>Summary:</h4>
		 * Returns <b>true</b> for valid input characters.
		 * only.
		 * <h4>Description:</h4>
		 * This method will return <b>true</b>, if data inputted contains allowed characters.
		 * This method will return <b>false</b> by displaying an <b>error</b> dialog, if data inputted contains invalid characters.
		 * 
		 * @method validateBasicReportInputFields
		 * @return {Boolean} 
		 */		  
		  validateBasicReportInputFields : function(){
			  var field = this;
				if(field && field.get("value") && dj.byId("swiftregexValue") && dj.byId("swiftregexValue").get("value"))
				{
					var regExPattern = new RegExp(dj.byId("swiftregexValue").get("value"));
					if(field && regExPattern.test(field.get("value")) == false) 
					{
						console.debug("[misys.report.common] Validating input-field value format : ", field);
						m.dialog.show('ERROR', m.getLocalization("invalidSWIFTTransactionError"));
						field.set("value", "");
						field.set("state", "Error");
						field.focus();
						return false;
					}
					return true;
				}
		  },
		  
		  toggleProductSections : function() {
			  var callback;
			  if(dj.byId('system_type') && dj.byId('system_type').get('checked')){
				  dj.byId('multi_product').set('checked',false);
				  callback = function(){
					  m.toggleFields(true, null, ['system_product']);
					  dj.byId('products').clear();
					  m.toggleColumnSection(false);
					  m.toggleReportDetailSections(false);
				  };
				  m.animate('fadeIn',d.byId('system_feture_section'), callback);
				  m.animate('fadeOut',d.byId('single_product_section'));
				  m.animate('fadeOut',d.byId('multi_product_section'));
				  m.animate('fadeOut',d.byId('multi_product_row'));
				  m.resetCandidateColumns();
			  }
			  //
			  // Summary: Toggle the display of sections for single- or multi-product reports. 
			  //
				  else{
					  m.animate('fadeIn',d.byId('multi_product_row'));
						  var isMultiple = dj.byId('multi_product').get('checked');
						  
						  callback = function(){
							  m.toggleFields(!isMultiple, null, ['single_product']);
							  m.toggleFields(false, null, ['system_product']);
							  if(!isMultiple) {
								  dj.byId('products').clear();
							  }
							  m.toggleColumnSection(false);
							  m.toggleReportDetailSections(false);
						  };
			
						  if(isMultiple) {
							  m.animate('fadeIn',d.byId('multi_product_section'), callback);
							  m.animate('fadeOut',d.byId('single_product_section'));
							  m.animate('fadeOut',d.byId('system_feture_section'));
						  } else {
							  m.animate('fadeIn',d.byId('single_product_section'), callback);
							  m.animate('fadeOut',d.byId('multi_product_section'));
							  m.animate('fadeOut',d.byId('system_feture_section'));
						  }
						  m.resetCandidateColumns();
				  }
		  },
		  
		  toggleColumnSection : function(/*Boolean*/ show) {
			  //
			  // Summary: Toggle the display of the "Displayed columns" section. We pass a boolean since the
			  // display or otherwise of this section is controlled by either the value of a FilteringSelect or
			  // the size of a GridMultipleItem store.
			  //
			  
			  // Reset
			  dj.byId('columns').clear();
			  dj.byId('order_list_by_default').set('checked', false);
			  dj.byId('use_absolute_width').set('checked', false);
			  
			  if(show) {
				  m.animate('fadeIn',d.byId('columns-section'));
			  } else {
				  m.animate('fadeOut',d.byId('columns-section'));
			  }
			  m.resetCandidateColumns();
		  },

		  toggleReportDetailSections : function(/*Boolean*/ show) {
			  //
			  // Summary: Toggle the display of the parameters, filters, grouping and chart sections.
			  //
			  var sections = [];
			  sections.push(d.byId('parameters-section'));
			  sections.push(d.byId('filters-section'));
			  sections.push(d.byId('overall-aggregates-section'));
			  sections.push(d.byId('grouping-section'));
			  sections.push(d.byId('chart-section'));
			  
			  if(show) {
				  d.forEach(sections, function(section){
					  m.animate('fadeIn',section);
				  });
			  } else {
				  dj.byId('parameters').clear();
				  dj.byId('filters').clear();
				  dj.byId(allAggregates).clear();
				  dj.byId(groupAggregates).clear();
				  dj.byId(chartAggregates).clear();
				  //dj.byId('grouping_display_records').set('checked', false);
				  dj.byId('grouping_enable').set('checked', false);
				  dj.byId('chart_flag').set('checked', false);
				  dj.byId('order_list_by_default').set('checked', false);
				  d.forEach(sections, function(section){
					  m.animate('fadeOut',section);
				  });
			  }
		  },
		  
		  toggleCriteriumFields : function() {
			//
			// Summary: Toggle the display of the criterium sections.
			//

			console.debug('In m.toggleCriteriumFields');
			
			var toHide = [];
			toHide.push(d.byId('criterium_parameter_section'));
			toHide.push(d.byId('criterium_pre_defined_value_section'));
			toHide.push(d.byId('criterium_values_set_section'));
			toHide.push(d.byId('criterium_string_section'));
			toHide.push(d.byId('criterium_number_section'));
			toHide.push(d.byId('criterium_amount_section'));
			toHide.push(d.byId('criterium_date_section'));
			toHide.push(d.byId('criterium_values_set_section'));
			toHide.push(d.byId('criterium_parameter_default_string_section'));
			toHide.push(d.byId('criterium_parameter_default_number_section'));
			toHide.push(d.byId('criterium_parameter_default_amount_section'));
			toHide.push(d.byId('criterium_parameter_default_date_section'));
			toHide.push(d.byId('criterium_parameter_default_values_set_section'));
			
			var toShow = [];
			
			var columnValue = dj.byId('criterium_column').get('value');
			if(columnValue !== '') {
				var isOperandParameter = dj.byId('criterium_value_type_1').get('checked');
				var isOperandValue = dj.byId('criterium_value_type_2').get('checked');
				var isOperandPreDefinedValue = dj.byId('criterium_value_type_3').get('checked');	//TODO: check what will be the final implementation
				
				// Retrieve column's type
				var columnType = arrColumn[columnValue][0];
				
				// Reset parameter and values section
				var callback = function(){
					m.toggleFields(isOperandParameter, ['criterium_parameter_default_string_value', 'criterium_parameter_default_number_value', 'criterium_parameter_default_date_value', 'criterium_parameter_default_values_set'], ['criterium_parameter'], true);
					m.toggleFields(isOperandValue, ['criterium_string_value', 'criterium_number_value', 'criterium_values_set', 'criterium_date_value', 'criterium_amount_value'], null, true);
					m.toggleFields(isOperandPreDefinedValue, 
							[
							'criterium_parameter_default_date_type_1',
							'criterium_parameter_default_date_type_2',
							'criterium_parameter_default_date_type_3',
							'criterium_parameter_default_date_type_4',
							'criterium_parameter_default_date_type_5',
							'criterium_parameter_default_date_type_6'], null, true);
				};

				// Operand is a parameter
				if(isOperandParameter)
				{
					console.debug('OPERAND PARAM');
					toShow.push(d.byId('criterium_parameter_section'));

					if(columnType === 'String')
					{
						 toShow.push(d.byId('criterium_parameter_default_string_section'));
					}
					else if(columnType === 'Number')
					{
						 toShow.push(d.byId('criterium_parameter_default_number_section'));
					}
					if(columnType === 'Amount')
					{
						toShow.push(d.byId('criterium_parameter_default_amount_section'));
					}
					else if(columnType === 'Date')
					{
						toShow.push(d.byId('criterium_parameter_default_date_section'));
					}
					else if(arrConstrainedParameterType.indexOf(columnType) !== -1)
					{
						toShow.push(d.byId('criterium_parameter_default_values_set_section'));
						m._fncSetCriteriumValuesList();
					}

					m._fncToggleParameterDefaultValuesSection(columnType);
				}
				// Operand is static
				else if(isOperandValue)
				{
					console.debug('OPERAND VALUE');
					dj.byId('criterium_string_value').set('required', false);
					dj.byId('criterium_number_value').set('required', false);
					dj.byId('criterium_amount_value').set('required', false);
					dj.byId('criterium_date_value').set('required', false);
					dj.byId('criterium_values_set').set('required', false);
					dj.byId('criterium_parameter_default_values_set').set('required', false);
					console.debug('COLUMN TYPE = '+ columnType);
					
					if(columnType === 'String')
					{
						toShow.push(d.byId('criterium_string_section'));
						dj.byId('criterium_string_value').set('required', true);
					}
					else if(columnType === 'Number')
					{
						toShow.push(d.byId('criterium_number_section'));
						dj.byId('criterium_number_value').set('required', true);
					}
					if(columnType === 'Amount')
					{
						toShow.push(d.byId('criterium_amount_section'));
						dj.byId('criterium_amount_value').set('required', true);
					}
					else if(columnType === 'Date')
					{
						toShow.push(d.byId('criterium_date_section'));
						dj.byId('criterium_date_value').set('required', true);
					}
					else if(arrConstrainedParameterType.indexOf(columnType) !== -1)
					{
						toShow.push(d.byId('criterium_values_set_section'));
						dj.byId('criterium_values_set').set('required', true);
						m._fncSetCriteriumValuesList(columnValue);
					}
				}
				else if (isOperandPreDefinedValue)
				{
					console.debug('OPERAND PREDEF');
					toShow.push(d.byId('criterium_pre_defined_value_section'));
				}
			}
			d.forEach(toHide, function(section) {
				if(d.indexOf(toShow, section) === -1) {
					m.animate('fadeOut',section);
				}
			});
			d.forEach(toShow, function(toShow1){
				  m.animate('fadeIn',toShow1, callback);
			  });
		  },
		  
		  toggleAggregateFields : function() {
			  
			 //
			 // Summary: Toggle display of aggregate fields.
			 //
				
			 if (m.dialog.isActive) {
				 console.debug('In m.toggleAggregateFields');

				 // Handle the event only if the dialog is already opened
				 var parent = m._fncGetParentWidget(this);
				
				 if(parent !== null && parent.open) {
					 // Clear dialog fields except column field
					 dj.byId('aggregate_type').set('value', '');
					 dj.byId('aggregate_eqv_cur_code').set('value', '');
					 dj.byId('aggregate_use_product_currency').set('checked', false);
					 d.forEach(languages, function(language){
						var label = dj.byId('aggregate_label_' + language); 
						if(label) {
							label.set('value', '');
						}
					  });
						
					  // Hide/display the equivalent currency
					  m.toggleCurrencySection();
						
					  // Set list of operators
					  m.setAggregatesList();
						
					  // Default label
					  m._fncDefaultAggregateColumnLabel(true);
				}
			 }
		  },
		  
		  toggleCurrencySection : function() {
			  //
			  // Summary: toggle display of currency fields
			  //
			  if(m.reportclient && m.reportclient.toggleCurrencySection)
			  {
			  	m.reportclient.toggleCurrencySection();																																																
			  } 
			  else {
			  var column = dj.byId('aggregate_column').get('value');
			  var aggregateType = dj.byId('aggregate_type').get('value');
			  var equivalentCurrency = dj.byId('aggregate_eqv_cur_code').get('value');
			  var doToggle = (column !== '' && arrColumn[column][0] === 'Amount') && (aggregateType !== '' && aggregateType !== 'count');
			  var callback = function() {
				 
			  };
			  var sections = [d.byId('aggregate_eqv_currency_section'), d.byId('auto_determine_currency_section')];
			  //var sections = [d.byId('aggregate_eqv_currency_section')];
			  if (doToggle)
			  {
				  d.forEach(sections, function(section){
					  m.animate('fadeIn',section);
					  m.toggleFields(doToggle, null, ['aggregate_eqv_cur_code'], false);
				  });
			  } else {
				  d.forEach(sections, function(section){
					  m.animate('fadeOut',section);
					  m.toggleFields(doToggle, null, ['aggregate_eqv_cur_code'], false);
				  });
			  }
			  }
		  },
		  
		  toggleAutoComputationOfEquivalentCurrency : function() {
			  //
			  // Summary: toggle equivalent currency auto-computation
			  //
			  
			  var equivalentCurrency = dj.byId('aggregate_eqv_cur_code').get('value');
			  dj.byId('aggregate_use_product_currency').set('checked', (equivalentCurrency === ''));
			  dj.byId('aggregate_use_product_currency').set('disabled', (equivalentCurrency !== ''));
					  },

		  toggleEquivalentCurrency : function() {
			  //
			  // Summary: toggle equivalent currency
			  //
			  
			 var isEquivalentCurrencyAutoComputed = dj.byId('aggregate_use_product_currency').get('checked');
			 dj.byId('aggregate_eqv_cur_code').set('required', !isEquivalentCurrencyAutoComputed);
			 dj.byId('aggregate_eqv_cur_code').set('disabled', isEquivalentCurrencyAutoComputed);
			 if(isEquivalentCurrencyAutoComputed)
			 {
				 dj.byId('aggregate_eqv_cur_code').set('value', ""); 
			 }
			 
		  },

		  toggleComputedFields : function() {
			  //
			  // Summary: Toggle the display of computed fields section
			  //
			  
			  console.debug('In m.toggleComputedFields start  m.dialog.isActive: ' + m.dialog.isActive);
			  var isComputedField = dj.byId('computed_field').get('checked');
			  var callback = function() {
					m.toggleFields(isComputedField, null, ['computed_field_id', 'operation', 'operand']);
			  };
					
			  if(isComputedField) {
				m.animate('fadeIn',d.byId('computation_section'), callback);
			  } else {
				m.animate('fadeOut',d.byId('computation_section'), callback);
			  }

			  console.debug('In m.toggleComputedFields end');
		  },
		  
		  toggleOrderDetails : function() {
			  //
			  // Summary: Toggle the order details section and default accordingly the order dtails
			  //
			  
			  var isChecked = this.get('checked');
			  var hideTT = function() {
							dj.hideTooltip(dijit.byId("addColumnButton").domNode);
						};
			  //case of editing a report or deleting all the column in new report
			  if(dijit.byId(colmnGrid))
			  {
				  var callback = function(){
					  m.toggleFields(isChecked &&  misys._getStoreSize(dijit.byId(colmnGrid).store) > 0,
								null, ['order_column', 'order_type']);
				  };
				  
				  if(isChecked &&  misys._getStoreSize(dijit.byId(colmnGrid).store) > 0) {
					  m.animate('fadeIn',d.byId("order_details_section"), callback);
				  }  else {
					  m.animate('fadeOut',d.byId("order_details_section"), callback);
				  }
				  if(misys._getStoreSize(dijit.byId(colmnGrid).store) === 0)
				  {
					  this.set("checked", false);
					  m.showTooltip(m.getLocalization("addAColumnFirst"),
								dijit.byId("addColumnButton").domNode, ["after"]);
						setTimeout(hideTT, 1000);
				  }
			  }
			  //case of creating a new report.
			  else
			  {
				  if(isChecked)
				  {
					  m.showTooltip(m.getLocalization("addAColumnFirst"),
								dijit.byId("addColumnButton").domNode, ["after"]);
						setTimeout(hideTT, 1000);
				  }
				  this.set("checked", false);
			  }
		  },
		  
		  toggleGroupingFields : function( /*Boolean*/ keepFieldValues) {
			  //
			  // Summary: Handle onChange event on grouping checkbox
			  //
			  var that = this;
			  var callback = function(){
				m.toggleFields(that.get("checked"),null, ['grouping_column'], keepFieldValues, true);
			  };

			  if (this.get("checked")) {
				m.animate('fadeIn',dojo.byId('grouping_details_section'), callback);
				// Clear chart section
				m._fncClearChartSection();
			  } else {
				m.animate('fadeOut',dojo.byId('grouping_details_section'), callback);
				m._fncClearGroupingSection();
			  }
		  },
		  
		  toggleChartFields : function() {
				//
				// Summary: Handle onChange event on chart checkbox
				//
				var showCharts = dj.byId('chart_flag').get('checked');
				var hideTT = function() {
							dj.hideTooltip(dijit.byId("addColumnButton").domNode);
						};
						
				//case of editing a report or deleting all the column in new report
				if(dijit.byId(colmnGrid))
				{
					var callback = function(){
						m.toggleFields(showCharts &&  misys._getStoreSize(dijit.byId(colmnGrid).store) > 0, null, ['chart_axis_x', 'chart_axis_x_scale', 'chart_rendering', chartAggregates]);
						dj.byId('chart_axis_x_scale').set('required', false);
					};
					if(showCharts &&  misys._getStoreSize(dijit.byId(colmnGrid).store) > 0)
					{
						m.animate('fadeIn',d.byId(chartField), callback);
						// Clear grouping section
						m._fncClearGroupingSection();
					}
					else
					{
						m.animate('fadeOut',d.byId(chartField), callback);
						dj.byId(chartAggregates).clear();
					}
					if (dj.byId(chartAggregates).store)
					{
						dj.byId(chartAggregates).addButtonNode.set('disabled', (m._getStoreSize(dj.byId(chartAggregates).store) > 0));
					}
					if(misys._getStoreSize(dijit.byId(colmnGrid).store) === 0)
					  {
						  this.set("checked", false);
						  m.showTooltip(m.getLocalization("addAColumnFirst"),
									dijit.byId("addColumnButton").domNode, ["after"]);
							setTimeout(hideTT, 1000);
					  }
				}
				//case of creating a new report.
				else
				{
					if(showCharts)
					{
						m.showTooltip(m.getLocalization("addAColumnFirst"),
										dijit.byId("addColumnButton").domNode, ["after"]);
						
						setTimeout(hideTT, 1000);
					}
					this.set("checked", false);
					m.animate('fadeOut',d.byId(chartField), callback);
					dj.byId(chartAggregates).clear();
				}
						
				// Clear all sections
				//fncClearParametersSection();
				//fncClearFiltersSection();
				//fncClearOverallAggregatesSection();
				//_fncClearGroupingSection();
				//fncClearChartSection();
						
				// Hide list report sections and display chart section
				//fncManageReportSections();
						
				// Set columns selectbox
				//var candidate = m.retrieveCandidate();
				//m.setColumns('criterium_column', candidate);
				//m.setColumns('chart_axis_x', candidate);
				//m.setAggregateColumns(candidate);
					
				// Hide/display axis X scale
				//d.hitch(dj.byId('chart_axis_x'), m.chartAxisXOnChange);
			  },
		  
		  //
		  // Handle onChange event on column field in Displayed Columns dialog
		  //
		  toggleColumnFields : function(event) {
				console.debug('In m.columnOnChange start  m.dialog.isActive: ' + m.dialog.isActive);
				//if (m.dialog.isActive) {		
					// Handle the event only if the dialog is already opened
					var isDialogAlreadyOpened = dj.byId('columns').dialog.open;
					if(isDialogAlreadyOpened) {
						var selectedColumn = dj.byId('column').get('value');
						
						// Clear dialog fields except column field
						d.forEach(languages, function(language){
							var label = dj.byId('label_' + language); 
							/*if(label)
							{
								//label.set('value', '');
							}*/
						});
						
						if(!dj.byId('alignment'))
							{
								dj.byId('alignment').set('value', '');
							}
						
						if(!dj.byId('width'))
							{
								dj.byId('width').set('value', '');
							}
						if(!dj.byId('eqv_cur_code'))
						{
							dj.byId('eqv_cur_code').set('value', '');
						}
						
						if(!dj.byId('computed_field_id'))
							{
								dj.byId('computed_field_id').set('value', '');
							}
						
						if(!dj.byId('operation'))
							{
								dj.byId('operation').set('value', '');
							}
						
						if(!dj.byId('operand'))
						{
							dj.byId('operand').set('value', '');
						}
						
						// Show/hide the equivalent currency section
						if(arrColumn[selectedColumn])
						{
							d.attr('eqv_currency_section', 'style', 'display:' + (arrColumn[selectedColumn][0] === 'Amount' ? 'block' : 'none'));
						}
						
						// Hide the computation section
						
						if(!dj.byId('computed_field'))
						{
							dj.byId('computed_field').set('checked', false);
							m.toggleComputedFields();
						}
						
			
						if (m.dialog.isActive || dj.byId('label_' + language).get('value') == '') 
						{
							// Default label
							console.log("Refreshing to default Column Label");
							m.defaultColumnLabel(true);
						}
						
						// Set list of operators
						m.setOperatorsList();
			
						// Set list of operands
						m.setOperands();
					}
				//}
				console.debug('In m.columnOnChange end');
		  },
		  
		  toggleCriteriumColumnFields : function() {
				//
				// Summary: Toggle column field in Criterium dialog
				//
				
				console.debug("TOGGLE CRITERIUM COLUMN");
				
				if (m.dialog.isActive) {
					console.debug('In fncCriteriumColumnOnChange');

					// Handle the event only if the dialog is already opened
					var parent = m._fncGetParentWidget(this);
				
					if(parent !== null && parent.open)
					{
						console.debug('PARENT NOT NULL');
						// Clear dialog fields except column field
						dj.byId('criterium_operator').set('value', '');
						dj.byId('criterium_parameter').set('value', '');
						dj.byId('criterium_string_value').set('value', '');
						dj.byId('criterium_number_value').set('value', '');
					//	dj.byId('criterium_amount_cur_code').set('value', '');
						dj.byId('criterium_amount_value').set('value', '');
						dj.byId('criterium_date_value').set('value', null);
						dj.byId('criterium_value_type_1').set('checked', false);
						dj.byId('criterium_value_type_2').set('checked', false);			
						dj.byId('criterium_value_type_3').set('checked', false);
						
						var sections = [
						                d.byId('criterium_parameter_section'),
						                d.byId('criterium_string_section'),
						                d.byId('criterium_number_section'),
						                d.byId('criterium_amount_section'),
						                d.byId('criterium_date_section'),
						                d.byId('criterium_values_set_section')
						];
						
						d.forEach(sections, function(section){
							  m.animate('fadeOut',section);
						  });
					
						// Set list of operators
						m.setCriteriumOperatorsList(dj.byId('criterium_column').get('value'));
						
						// The list of parameters is already updated when opening the dialog
						//m.setCriteriumParametersList();
						
						// Set list of values (when the column is of type ValuesSet)
						m._fncSetCriteriumValuesList(dj.byId('criterium_column').get('value'));
					
						// Set the column type field
						if (this.get('value') !== '' && this.get('value') !== null)
						{
							var columnType = arrColumn[this.get('value')][0];
							dj.byId('criterium_column_type').set('value', columnType);
			
							// Show/hide default values section depending on the column type
							m._fncToggleParameterDefaultValuesSection(columnType);
			
							// Disable/Enable pre-defined value radio if the column is not a Date
							dj.byId('criterium_value_type_3').set('disabled', columnType != 'Date');
							dj.byId('criterium_value_type_2').set('hidden', columnType != 'String' || columnType != 'Date');
						/*	if(columnType != 'String') {
							        m.animate('fadeOut', d.byId('criterium_operand_type_section_2'));
							}
							else
							        {
							        m.animate('fadeIn', d.byId('criterium_operand_type_section_2'));
							        }*/
						}
					}
				}
		   },
		   
		   toggleCriteriumOperatorFields : function()
		   {
	 	 	 	//
	 	 	 	// Summary:Clears all the fields if the Criterium operator value is inNull. 
	 	 	 	//
	 	 	 	if(dj.byId('criterium_operator').get('value') === "isNull")
	 	 	 	{                                  
	 	 	 	    dj.byId('criterium_parameter').set('value', '');
	 	 	 	    dj.byId('criterium_string_value').set('value', '');
	 	 	 	    dj.byId('criterium_number_value').set('value', '');
	 	 	 	  //  dj.byId('criterium_amount_cur_code').set('value', '');
	 	 	 	    dj.byId('criterium_amount_value').set('value', '');
	 	 	 	    dj.byId('criterium_date_value').set('value', null);
	 	 	 	    dj.byId('criterium_value_type_1').set('checked', false);
	 	 	 	    dj.byId('criterium_value_type_2').set('checked', false);
	 	 	 	    dj.byId('criterium_value_type_3').set('checked', false);
	 	 	 	 }
	 	 	 },
		   
		   toggleCriteriumParameterDefaultDate : function() {
			   //
			   // Summary: Toggle criterium parameter default date. Referenced in the Criteria class, aswell
			   // as the report binding. 
			   //
			   
			   var selectedValue = "";
			   var radioDomNodes = d.query("[name='criterium_parameter_default_date_type']", d.byId('criterium_pre_defined_value_section'));
			   d.some(radioDomNodes, function(radioDomNode){
					var radioWidget = dj.byNode(radioDomNode.parentNode);
					var checked = radioWidget.get('checked'); 
					if (checked)
					{
						selectedValue = radioWidget.params.value;
						return true;
					}
			   });
				
			   switch(selectedValue) {
			   	case '01':
						m._fncEnableReportExecutionDate(true);
						m._fncEnableFirstDayOfCurrentMonth(false);
						m._fncEnableLastDayOfCurrentMonth(false);
						m._fncEnableToday(false);
						m._fncEnableTomorrow(false);
						m._fncEnableYesterday(false);
						break;
				case '02':
						m._fncEnableReportExecutionDate(false);
						m._fncEnableFirstDayOfCurrentMonth(true);
						m._fncEnableLastDayOfCurrentMonth(false);
						m._fncEnableToday(false);
						m._fncEnableTomorrow(false);
						m._fncEnableYesterday(false);
						break;
				case '03':
						m._fncEnableReportExecutionDate(false);
						m._fncEnableFirstDayOfCurrentMonth(false);
						m._fncEnableLastDayOfCurrentMonth(true);
						m._fncEnableToday(false);
						m._fncEnableTomorrow(false);
						m._fncEnableYesterday(false);
						break;
				case '04':
						m._fncEnableReportExecutionDate(false);
						m._fncEnableFirstDayOfCurrentMonth(false);
						m._fncEnableLastDayOfCurrentMonth(false);
						m._fncEnableToday(true);
						m._fncEnableTomorrow(false);
						m._fncEnableYesterday(false);
						break;
				case '05':
						m._fncEnableReportExecutionDate(false);
						m._fncEnableFirstDayOfCurrentMonth(false);
						m._fncEnableLastDayOfCurrentMonth(false);
						m._fncEnableToday(false);
						m._fncEnableTomorrow(true);
						m._fncEnableYesterday(false);
						break;
				case '06':
						m._fncEnableReportExecutionDate(false);
						m._fncEnableFirstDayOfCurrentMonth(false);
						m._fncEnableLastDayOfCurrentMonth(false);
						m._fncEnableToday(false);
						m._fncEnableTomorrow(false);
						m._fncEnableYesterday(true);
						break;
				default:
						m._fncEnableReportExecutionDate(false);
						m._fncEnableFirstDayOfCurrentMonth(false);
						m._fncEnableLastDayOfCurrentMonth(false);
						m._fncEnableToday(false);
						m._fncEnableTomorrow(false);
						m._fncEnableYesterday(false);
						break;
				}
			},
		  
		  resetCandidateColumns : function() {
			  //
			  // Summary: Reset product columns
			  //
			  var candidate = m.retrieveCandidate();
			  m.setColumns('column', candidate);
			  m.setColumns('order_column', candidate);
			  m.setColumns('criterium_column', candidate);
			  m.setColumns('grouping_column', candidate);
			  m.setColumns('chart_axis_x', candidate);
			  m.setAggregateColumns(candidate);
		  },
		  
		   criteriumOpenDialogFromExistingItemInitFunction : function(item) {
			  //
			  // Summary: Function executed when the criterium dialog is opened. Referenced in the Criteria class.
			  //
			  
			  // TODO Update
				
			  // This function will show/hide the parameter and value section depending on the column's type 
			  
			  if(misys.reportclient && misys.reportclient.criteriumOpenDialogFromExistingItemInitFunction)
			  {
				  misys.reportclient.criteriumOpenDialogFromExistingItemInitFunction();
			  }
			  else
			  {
				  console.debug('In m.criteriumOpenDialogFromExistingItemInitFunction');
				  var isOperandParameter = dj.byId('criterium_value_type_1').get('checked');
				  var isOperandValue = dj.byId('criterium_value_type_2').get('checked');
				  var isOperandPreDefinedValue = dj.byId('criterium_value_type_3').get('checked');	// TODO: check for implementation
					
				  // Retrieve column's type
				  var columnValue = dj.byId('criterium_column').get('value');
				  var columnType = arrColumn[columnValue][0];
					
				  // Operand is a parameter
				  if(isOperandParameter) {
					// Hide values section
					d.byId('criterium_string_section').style.display = 'none';
					d.byId('criterium_number_section').style.display = 'none';
					d.byId('criterium_amount_section').style.display = 'none';
					d.byId('criterium_date_section').style.display = 'none';
					d.byId('criterium_values_set_section').style.display = 'none';

					// Display parameter section
					d.byId('criterium_parameter_section').style.display = 'block';

					// Hide pre-defined value section
					d.style('criterium_pre_defined_value_section', 'display', 'none');

					// Hide/display parameter default values section depending on the column type
					m._fncToggleParameterDefaultValuesSection(columnType);
				  }
					// Operand is static
				  else if(isOperandValue) {
					if(arrColumn[columnValue]) {
						// Hide/display values section depending on the column type
						d.byId('criterium_parameter_section').style.display = 'none';
						d.byId('criterium_string_section').style.display = (columnType === 'String' ? 'block' : 'none');
						d.byId('criterium_number_section').style.display = (columnType === 'Number' ? 'block' : 'none');
						d.byId('criterium_amount_section').style.display = (columnType === 'Amount' ? 'block' : 'none');
						d.byId('criterium_date_section').style.display = (columnType === 'Date' ? 'block' : 'none');
						if(arrConstrainedParameterType.indexOf(columnType) !== -1)
						{
							d.byId('criterium_values_set_section').style.display = 'block';
						}
						else
						{
							d.byId('criterium_values_set_section').style.display = 'none';
						}
						// Hide pre-defined value section
						d.style('criterium_pre_defined_value_section', 'display', 'none');
					}
				  }
				  // TODO: check for correct implementation
				  // Operand is pre-defined
				  else if(isOperandPreDefinedValue) {
					if(arrColumn[columnValue]) {
						// Hide values section depending on the column type
						d.style('criterium_parameter_section', 'display', 'none');
						d.style('criterium_string_section', 'display', 'none');
						d.style('criterium_number_section', 'display', 'none');
						d.style('criterium_amount_section', 'display', 'none');
						d.style('criterium_date_section', 'display', 'none');
						d.style('criterium_values_set_section', 'display', 'none');
							
						// Show pre-defined value section
						d.style('criterium_pre_defined_value_section', 'display', 'block');
					}
				  }
					
				  // Disable pre-defined value radio if the column is not a Date
				  if (columnType != 'Date') {
					dj.byId('criterium_value_type_3').set('disabled', true);
					d.style('criterium_pre_defined_value_section', 'display', 'none');
				  }
			  }	  
		  },
		  

		  displayColumnLabelsInOtherLanguages : function() {
			//
			// Summary: Display the column labels in language other than the default one
			//
				
			d.style('display_displayed_column_labels', 'display', 'none');
		    d.style('hide_displayed_column_labels', 'display', 'inline');
			m.animate('fadeIn',d.byId('displayed_column_labels_other_languages'));
		  },

		  hideColumnLabelsInOtherLanguages : function() {
			//
			// Display the column labels in language other than the default one
			//
				
			console.debug('In m.hideColumnLabelsInOtherLanguages');
			d.style('display_displayed_column_labels', 'display', 'inline');
			d.style('hide_displayed_column_labels', 'display', 'none');
			m.animate('fadeOut',d.byId('displayed_column_labels_other_languages'));
		  },

		  defaultDataInPage : function() {
			  //
			  // Summary: Set Columns fields in all sections
			  //
				
			  var candidate = m.retrieveCandidate();
			  m.setColumns('column', candidate);
			  m.setColumns('order_column', candidate);
			  m.setColumns('criterium_column', candidate);
			  m.setColumns('grouping_column', candidate);
			  m.setColumns('chart_axis_x', candidate);
			  m.setAggregateColumns(candidate);
				
			  // Set grouping column
			  var groupingColumn = dj.byId('hidden_grouping_column').get('value');
			  dj.byId('grouping_column').set('value', groupingColumn);

			  // Set axis X column
			  var axisXColumn = dj.byId('hidden_chart_axis_x').get('value');
			  dj.byId('chart_axis_x').set('value', axisXColumn);
		  },

		  defaultColumnLabel : function(override) {
				//
				// Summary: Default the column label. Referenced aswell in the Aggregates class.
				//
				console.debug('In m.defaultColumnLabel, override: ' + override);
				var columnValue = dj.byId('column').get('value');
				if(columnValue && columnValue !== "")
				{
					var columnLabelField = dj.byId('label_' + language);
					var defaultLabel = arrColumn[columnValue][1];
					if((columnLabelField.get('value') === '' || override) && columnLabelField.get('value') != defaultLabel)
					{
						
						dj.byId('label_' + language).set('value', defaultLabel);
					}
				}
		  },

		  displayParameterLabelsInOtherLanguages : function() {
			  //
			  // Summary: Display the parameter labels in language other than the default one
			  //
			  d.byId('display_parameter_labels').style.display = 'none';
			  d.byId('hide_parameter_labels').style.display = 'inline';
			  d.byId('parameter_labels_other_languages').style.display = 'block';
		  },

			
		  hideParameterLabelsInOtherLanguages : function() {
			  //
			  // Summary: Display the parameter labels in language other than the default one
			  //
			  d.byId('hide_parameter_labels').style.display = 'none';
			  d.byId('parameter_labels_other_languages').style.display = 'none';
			  //m.animate('fadeIn',d.byId('display_parameter_labels'));
			  misys.animate("fadeIn", d.byId('display_parameter_labels'), null, false, {display : "inline"});
		  },
			
			
		  displayAggregateLabelsInOtherLanguages : function() {
			  //
			  // Summary: Display the aggregate labels in language other than the default one
			  //
			  d.byId('display_aggregate_labels').style.display = 'none';
			  d.byId('hide_aggregate_labels').style.display = 'inline';
			  d.byId('aggregate_labels_other_languages').style.display = 'block';
		  },

		  hideAggregateLabelsInOtherLanguages : function() {
			  //
			  // Summary: Display the aggregate labels in language other than the default one
			  //
//			  m.animate('fadeOut',d.byId('aggregate_labels_other_languages'));
//			  d.byId('hide_aggregate_labels').style.display = 'none';
//			  d.byId('display_aggregate_labels').style.display = 'block';
			  
			  d.byId('hide_aggregate_labels').style.display = 'none';
			  d.byId('aggregate_labels_other_languages').style.display = 'none';
			  //m.animate('fadeIn',d.byId('display_parameter_labels'));
			  misys.animate("fadeIn", d.byId('display_aggregate_labels'), null, false, {display : "inline"});			  
		  },

			
		  getAggregateOperatorDecode : function(/*String*/ value) {
			  //
			  // Summary: Get aggregate operator decode based on operator code. Referenced in
			  // Aggregates and ChartAggregates.
			  //
			  return aggregateOperators[value];
		  },

			
		  getCriteriaOperatorDecode : function(/*String*/ value) {
			  //
			  // Summary:  Get criterium operator decode based on operator code. Referenced in
			  // Criteria class.
			  //
			  return criteriaOperators[value];
		  },

		  setColumns : function(/*String*/ fieldName, /*String*/ candidate) {
			  //
			  // Summary: Set columns upon product change. Referenced in Columns class.
			  //
				
			  if(candidate != '') {
				var data = m._fncBuildColumnsData(fieldName, candidate);
				var store = new d.data.ItemFileReadStore({ data: data });
				dj.byId(fieldName).store = store;
				dj.byId(fieldName).set('searchAttr', 'name');
			  }
		  },
			
		  setAggregateColumns : function(/*String*/ candidate) {
			 //
			 // Summary: Set aggregate columns upon product change. Referenced in Aggregate class.
			 //
			 if(candidate !== '') {
				// Build the data structure with the product's columns 
				var data = m._fncBuildColumnsData("aggregate_column", candidate);

				// Add the possible computed columns
				var columns = dj.byId('columns');
				if (columns.grid)
				{
					columns.grid.store.fetch({query: {column: '*'}, onComplete: function(items, request){
						d.forEach(items, function(item){
							if (item.computed_field_id != '')
							{
								var description = item['label_' + language];
								data.items.push({column: item.computed_field_id, name: description});
							}
						});
					}});
				}
				
				// Populate the aggregate select box
				var store = new d.data.ItemFileReadStore({ data: data });
				dj.byId('aggregate_column').store = store;
				dj.byId('aggregate_column').set('searchAttr', 'name');
			}
		 },
				
		 retrieveCandidate : function() {
				//
				// Summary: Retrieve the candidate name. Referenced in Aggregate and Columns classes.
				//
			 
			 	if(dj.byId('system_type') && dj.byId('system_type').get('checked'))
			 		{
			 			return dj.byId('system_product').get('value');
			 		}
				
				// Multi-product
				if(dj.byId('multi_product').get('checked'))
				{
					var candidate = '';
					
					var productsGrid = dj.byId('products-grid');
					if (productsGrid)
					{
						productsGrid.store.fetch({query: {store_id: '*'}, onComplete: function(items, request){
							if(items.length > 0)
							{
								var product = items[0].product[0];

								// Test if the product is a transaction
								if(product.match('Tnx$') == 'Tnx')
								{
									candidate = 'AllTnx';
								}
								
								// Test if the product is a template
								else if(product.match('Template$') == 'Template')
								{
									candidate = 'Alltemplate';
								}

								// Otherwise it is a master product
								else{
									candidate = 'AllMaster';
								}
							}
			    		}});
					}
					return candidate;
				}
				// Single product
				return dj.byId('single_product').get('value');
			},

			setOperands : function(item)
			{
				//
				// Summary: Set the list of operators based on the type of the column. Referenced in 
				// Columns class.
				//
				console.debug('In m.setOperands start  m.dialog.isActive: ' + m.dialog.isActive);
				if (m.dialog.isActive)
				{		
					var selectedColumn = dj.byId('column').get('value');
					if(arrColumn[selectedColumn])
					{
						var selectedColumnType = arrColumn[selectedColumn][0];
						var candidate = m.retrieveCandidate();
						var data = { identifier: 'column', label: 'name', items: [] };
						d.forEach(arrProductColumn[candidate], function(column){
							if(column)
							{
								if(arrColumn[column] && arrColumn[column][0] == selectedColumnType)
								{
									data.items.push({column: column, name: arrColumn[column][1]});
								}
								else
								{
									console.debug('m.columnOnChange - Missing column ' + column + ' for candidate ' + candidate);
								}
							}
						});
						var store = new d.data.ItemFileReadStore({ data: data });
						dj.byId('operand').store = store;
						dj.byId('operand').set('searchAttr', 'name');
						if(item)
						{
							if(item.operand[0].toString() != '')
							{
								dj.byId('operand').set('value', item.operand[0].toString());
							}
						}
					}
				}
				console.debug('In m.setOperands end');
			},
			
			setOperatorsList : function(item)
			{
				//
				// Summary: Default column operator based on the column's type. Referenced in the Columns class.
				//
				console.debug('In m.setOperatorsList start  m.dialog.isActive: ' + m.dialog.isActive);
				if (m.dialog.isActive)
				{		
				var arrOperators = [];
				var column = dj.byId('column').get('value');
				
				if(arrColumn[column])
				{
					if(arrColumn[column][0] == 'Amount')
					{
						arrOperators = ['+', '-', '/'];
					}
					else if(arrColumn[column][0] == 'Date')
					{
						arrOperators = ['-'];
					}
					else if(arrColumn[column][0] == 'String')
					{
						arrOperators = ['+'];
					}
					else if(arrColumn[column][0] == 'Number')
					{
						arrOperators = ['+', '-', '*', '/'];
					}
				}
				else
				{
					console.debug('m.setOperatorsList - Missing column ' + column + arrColmn);
				}

				var data = { identifier: 'operator', label: 'name', items: [] };
				d.forEach(arrOperators, function(operator){
					if(operator)
					{
						data.items.push({operator: operator, name: arrComputation[operator]});
					}
				});
				var store = new d.data.ItemFileReadStore({ data: data });
				dj.byId('operation').store = store;
				dj.byId('operation').set('searchAttr', 'name');
				if(item)
				{
					if(item.operation[0].toString() != '')
						{
							dj.byId('operation').set('value', item.operation[0].toString());
						}
					}
				}
				console.debug('In m.setOperatorsList end');
			},

			setCriteriumValuesSetList : function(columnValue)
			{
				m._fncSetCriteriumValuesList(columnValue);
			},
			
			setCriteriumParametersList : function(currentCriteriumParameterValue)
			{
				//
				// Summary: Default the criterium's parameters list. Referenced in the Criteria class.
				//
				
				console.debug('In m.setCriteriumParametersList');
				var parameters = dj.byId('parameters');
				if(parameters.grid)
				{
					// Find already used parameters in all criteria and store them in an array
					var alreadyUsedParameters = [];
					//Commented as part of MPS-58448
					/*dj.registry.byClass('misys.report.widget.Criteria').forEach(function(criterium) {
						if (criterium.grid && criterium.grid.store)
						{
							criterium.grid.store.fetch({
								query: {store_id: '*'},
								onItem : function(item, request){
									if (item.parameter)
									{
										alreadyUsedParameters.push(d.isArray(item.parameter) ? item.parameter[0] : item.parameter);
									}
								}
								});
						}
					});*/
					
					// Create the available parameter's select box 
					var data = { identifier: 'parameter', label: 'name', items: [] };
					parameters.grid.store.fetch({query: {parameter_name: '*'}, onComplete: function(items, request){
		    			d.forEach(items, function(item){
		    				//Commented as part of MPS-58448
		    				/*d.some(alreadyUsedParameters, function(alreadyUsedParameter){
		    					var name = d.isArray(this.parameter_name) ? this.parameter_name[0] : this.parameter_name;
		    					if (name == alreadyUsedParameter)
		    					{
		    						canParameterBeAdded = false;
		    						return true;
		    					}
		    					return false;
		    				}, item);*/
		    					data.items.push({parameter: item.parameter_name, name: item['label_' + language]});
		    			});
		    		}});

					var store = new d.data.ItemFileReadStore({ data: data });
					dj.byId('criterium_parameter').store = store;
					dj.byId('criterium_parameter').set('searchAttr', 'name');
				}
			},

			setCriteriumOperatorsList : function(column)
			{
				//
				// Summary: Default the criterium's operators depending on the column type. Referenced in the
				// Criteria class.
				//
				
				var arrOperators = [];
			
				console.debug('In m.setCriteriumOperatorsList - column: ' + column);
				if(arrColumn[column])
				{
					if(arrColumn[column][0] == 'Amount')
					{
						arrOperators = ['different', 'equal', 'infOrEqual', 'supOrEqual', 'inferior', 'superior'];
					}
					else if(arrColumn[column][0] == 'Date')
					{
						 arrOperators = ['different', 'equal', 'infOrEqual', 'supOrEqual', 'inferior', 'superior'];
					}
					else if(arrColumn[column][0] == 'String')
					{
						arrOperators = ['different', 'equal', 'like', 'notLike','isNull','isNotNull'];
					}
					else if(arrColumn[column][0] == 'Number')
					{
						arrOperators = ['different', 'equal', 'infOrEqual', 'supOrEqual', 'inferior', 'superior'];
					}
					else if(arrConstrainedParameterType.indexOf(arrColumn[column][0]) !== -1)
					{
						arrOperators = ['different', 'equal', 'isNull', 'isNotNull'];
					}
				}
				else
				{
					console.debug('m.setCriteriumOperatorsList - Missing column ' + column + arrColmn);
				}
			
				var data = { identifier: 'operator', label: 'name', items: [] };
				d.forEach(arrOperators, function(operator){
					if(operator)
					{
						data.items.push({operator: operator, name: criteriaOperators[operator]});
					}
				});
				var store = new d.data.ItemFileReadStore({ data: data });
				dj.byId('criterium_operator').store = store;
				dj.byId('criterium_operator').set('searchAttr', 'name');
			},

			getCriteriumOperand : function(rowIndex, item)
			{
				//
				// Summary: Manage the display of the column value in the grid. Referenced in the
				// Criteria class.
				//
				
				var operandValue = '';
				if(item && arrColumn[item.column])
				{
					var valueType = d.isArray(item.value_type) ? item.value_type[0] : item.value_type;
					var columnType = arrColumn[item.column][0];
					if (valueType == '01')	// If the value refers to a parameter
					{
						operandValue = m.getLocalization('parameterLabel') +  ' ' + item.parameter;
					}
					else if (valueType == '02')	// If the value refers to a value
					{
						if(columnType === 'String')
						{
							operandValue = item.string_value;
						}
						else if(columnType === 'Number')
						{
							operandValue = item.number_value;
						}
						if(columnType === 'Amount')
						{
							operandValue = item.amount_value;
						}
						else if(columnType === 'Date')
						{
							operandValue = item.date_value;
						}
						else if(arrConstrainedParameterType.indexOf(columnType) !== -1)
						{
							var searchedValue = item.values_set;
							var valueSetData = [];
							var candidate = m.retrieveCandidate();
							if(arrValuesSetProduct[item.column])
							{
								if(candidate.indexOf('All') === 0)
								{
									valueSetData = arrValuesSetProduct[item.column]['All'];
								}
								else
								{
									valueSetData = arrValuesSetProduct[item.column][candidate.substring(0,2)];
								}
							}
							if(valueSetData.length === 0 && arrValuesSet[item.column])
							{
								valueSetData = arrValuesSet[item.column];
							}
							var foundElement = d.filter(valueSetData, function(element){
								return element[0] == searchedValue;
							});
							operandValue = (foundElement.length > 0 ? foundElement[0][1] : '');
						}
					}
					else if (valueType == '03')	// If the value refers to a pre-defined value
					{
						var dateType = d.isArray(item.default_date_type) ? item.default_date_type[0] : item.default_date_type;
						var offsetType = '';
						var offsetDays = '';
						switch (dateType)
						{
							case '01':
								offsetType = d.isArray(item.default_date_report_exec_date_offset) ? item.default_date_report_exec_date_offset[0] : item.default_date_report_exec_date_offset; 
								offsetDays = d.isArray(item.default_date_report_exec_date_offset_days) ? item.default_date_report_exec_date_offset_days[0] : item.default_date_report_exec_date_offset_days; 
								operandValue = m.getLocalization('reportExecutionDate') + (offsetType == '01' ? ' + ' : ' - ') + offsetDays + ' ' + m.getLocalization('days');
								break;
							case '02':
								offsetType = d.isArray(item.default_date_first_day_of_month_offset) ? item.default_date_first_day_of_month_offset[0] : item.default_date_first_day_of_month_offset; 
								offsetDays = d.isArray(item.default_date_first_day_of_month_offset_days) ? item.default_date_first_day_of_month_offset_days[0] : item.default_date_first_day_of_month_offset_days; 
								operandValue = m.getLocalization('firstDayOfCurrentMonth') + (offsetType == '01' ? ' + ' : ' - ') + offsetDays + ' ' + m.getLocalization('days');
								break;
							case '03':
								offsetType = d.isArray(item.default_date_last_day_of_month_offset) ? item.default_date_last_day_of_month_offset[0] : item.default_date_last_day_of_month_offset; 
								offsetDays = d.isArray(item.default_date_last_day_of_month_offset_days) ? item.default_date_last_day_of_month_offset_days[0] : item.default_date_last_day_of_month_offset_days; 
								operandValue = m.getLocalization('lastDayOfCurrentMonth') + (offsetType == '01' ? ' + ' : ' - ') + offsetDays + ' ' + m.getLocalization('days');
								break;
							case '04':
								operandValue = m.getLocalization('today');
								break;
							case '05':
								operandValue = m.getLocalization('tomorrow');
								break;
							case '06':
								operandValue = m.getLocalization('yesterday');
								break;
							default:
								break;
						}
					}
				}
				return operandValue;
			},

			aggregateTypeOnChange : function(event)
			{
				//
				// Summary: Handle onChange event on aggregate type field in Aggregate dialog
				//
				if (m.dialog.isActive)
				{
					console.debug('In m.aggregateTypeOnChange');

					 // Handle the event only if the dialog is already opened
					 var isDialogAlreadyOpened = (dj.byId(allAggregates).dialog && dj.byId(allAggregates).dialog.open) || 
												(dj.byId(groupAggregates).dialog && dj.byId(groupAggregates).dialog.open);
					 if(isDialogAlreadyOpened)
					 {
						// Clear equivalent Currency and set equivalent currency auto-computation
						dj.byId('aggregate_use_product_currency').set('checked', false);
						dj.byId('aggregate_eqv_cur_code').set('value', '');
						dj.byId('aggregate_eqv_cur_code').set('required', false);

						// Default label
						m._fncDefaultAggregateColumnLabel(true);
						
						// Hide/display the equivalent currency
						m.toggleCurrencySection();
					 }
				}
			},

			setAggregatesList : function(column)
			{
				//
				// Summary: Default the aggregate functions depending on the column type. Referenced in 
				// Aggregates class. 
				//
				if(misys.reportclient && misys.reportclient.setAggregatesList)
				{
					  misys.reportclient.setAggregatesList(column);
				}
				else
				{
					var arrOperators = [];
					
					// If column is not passed in, we try to get it from the aggregate dialog
					column = column ? column : dj.byId('aggregate_column').get('value');
				
					if(arrColumn[column])
					{
						if(arrColumn[column][0] == 'Amount')
						{
							arrOperators = ['sum', 'count', 'average', 'minimum', 'maximum'];
						}
						else if(arrColumn[column][0] == 'String' || arrColumn[column][0] == 'Date')
						{
							arrOperators = ['count'];
						}
						else if(arrColumn[column][0] == 'Number')
						{
							arrOperators = ['sum', 'count', 'average', 'minimum', 'maximum'];
						}
						else if(arrConstrainedParameterType.indexOf(arrColumn[column][0]) !== -1)
						{
							arrOperators = ['count'];
						}
					}
					else
					{
						console.debug('m.setAggregatesList - Missing column ' + column + arrColmn);
					}
				
					var data = { identifier: 'operator', label: 'name', items: [] };
					d.forEach(arrOperators, function(operator){
						if(operator)
						{
							data.items.push({operator: operator, name: aggregateOperators[operator]});
						}
					});
					var store = new d.data.ItemFileReadStore({ data: data });
					dj.byId('aggregate_type').store = store;
					dj.byId('aggregate_type').set('searchAttr', 'name');
				}
			},

			chartAxisXOnChange : function()
			{
				//
				// Summary: Handle onChange event on chart checkbox
				//
				
				var column = this.get('value');
				if(column !== '' && arrColumn[column][0] === 'Date')
				{
					d.byId("chart-x-scale-section").style.display = 'block';
				}
				else
				{
					d.byId("chart-x-scale-section").style.display = 'none';
					dj.byId("chart_axis_x_scale").set("value","");
				}
				//dj.byId('chart_axis_x_scale').set('required', (column != '' && arrColumn[column][0] == 'Date'));
				dj.byId('chart_axis_x_scale').set('required', false);
			},
			
			groupingColumnOnChange : function()
			{
				//
				// Summary: Handle onChange event on chart checkbox
				//
				
				var column = this.get('value');
				var isDate = (column != '' && arrColumn[column][0] == 'Date');
				d.byId("group-scale-section").style.display = isDate ? 'block' : 'none';
				dj.byId('grouping_column_scale').set('required', false);
				if (!isDate)
				{
					dj.byId('grouping_column_scale').set('value', '');
				}
			},

			_getStoreSize : function(/*DataStore*/ store) {
				//
				// Summary: Returns the size of a DataStore
				//
				
				if(store && store._getItemsArray) {
					return store._getItemsArray().length;
				}
			},
			
			_fncClearGroupingSection : function()
			{
				//
				// Summary: Clear grouping section
				//
				
				dj.byId('grouping_enable').set('checked', false);
				dj.byId(groupAggregates).clear();
				dj.byId('grouping_column').set('value', '');
				dj.byId('grouping_column_scale').set('value', '');
			},
			
			_fncClearChartSection : function()
			{
				//
				// Summary: Clear chart section
				//
				
				dj.byId('chart_flag').set('checked', false);
				dj.byId('chart_rendering').set('value', '');
				dj.byId('hidden_chart_axis_x').set('value', '');
				dj.byId('chart_axis_x').set('value', '');
				dj.byId('chart_axis_x_scale').set('value', '');
				dj.byId(chartAggregates).clear();
			},

			_fncBuildColumnsData : function(fieldName, candidate)
			{
				//
				// Summary: Build an data structure containing all columns associated to a candidate
				//
				var data = { identifier: 'column', label: 'name', items: [] };
				var arrayColumns = [];
				switch(fieldName) 
				{
				case 'order_column' : 
					arrayColumns = arrProductOrderColumn[candidate];
					break;
				case 'criterium_column' : 
					arrayColumns = arrProductCriteriaColumn[candidate];
					break;
				case 'grouping_column' : 
					arrayColumns = arrProductGroupColumn[candidate];
					break;
				case 'chart_axis_x' : 
					arrayColumns = arrProductChartXAxisColumn[candidate];
					break;
				case 'aggregate_column' : 
					arrayColumns = arrProductAggregateColumn[candidate];
					break;
				default :
					arrayColumns = arrProductColumn[candidate];
					break;
				}
				
				if(!arrayColumns || arrayColumns.length === 0 )
				{
					arrayColumns = arrProductColumn[candidate];
				}
				d.forEach(arrayColumns, function(column){
				var narrativeRegExPattern = new RegExp('Narrative@');
			    if(arrColumn[column] && fieldName === 'column')
			    {
			       data.items.push({column: column, name: arrColumn[column][1]});
			    }
			    else if (arrColumn[column] && narrativeRegExPattern.test(column) === false)
			    {
			       data.items.push({column: column, name: arrColumn[column][1]});
			    }
			    else
			    {
			       console.debug('Missing column ' + column + ' for candidate ' + candidate);
			    }});
				return data;
			},
			
			_fncToggleParameterDefaultValuesSection : function(columnType)
			{
				console.debug("In m._fncToggleParameterDefaultValuesSection");
				d.byId('criterium_parameter_default_string_section').style.display = (columnType == 'String' ? 'block' : 'none');
				d.byId('criterium_parameter_default_number_section').style.display = (columnType == 'Number' ? 'block' : 'none');
				d.byId('criterium_parameter_default_amount_section').style.display = (columnType == 'Amount' ? 'block' : 'none');
				d.byId('criterium_parameter_default_date_section').style.display = (columnType == 'Date' ? 'block' : 'none');
				if(arrConstrainedParameterType.indexOf(columnType) !== -1)
				{
					d.byId('criterium_parameter_default_values_set_section').style.display = 'block';
				}
				else
				{
					d.byId('criterium_parameter_default_values_set_section').style.display = 'none';
				}
			},
			
			_fncSetCriteriumValuesList : function(columnValue)
			{
				//
				// Summary: Default the criterium's operators depending on the column type
				//
				console.debug('In m._fncSetCriteriumValuesList');
				var column = columnValue;
			
				if(arrColumn[column] && arrConstrainedParameterType.indexOf(arrColumn[column][0]) !== -1)
				{
					var data = { identifier: 'value', label: 'name', items: [] };
					var valueSetData = [];
					var candidate = m.retrieveCandidate();
					if(arrValuesSetProduct[column])
					{
						if(candidate.indexOf('All') === 0)
						{
							valueSetData = arrValuesSetProduct[column]['All'];
						}
						else
						{
							valueSetData = arrValuesSetProduct[column][candidate.substring(0,2)];
						}
					}
					if(valueSetData.length === 0 && arrValuesSet[column])
					{
						valueSetData = arrValuesSet[column];
					}
					d.forEach(valueSetData, function(arrValue){
						data.items.push({value: arrValue[0], name: arrValue[1]});
					});
					var store = new d.data.ItemFileReadStore({ data: data });
					dj.byId('criterium_values_set').store = store;
					dj.byId('criterium_values_set').set('searchAttr', 'name');
					
					dj.byId('criterium_parameter_default_values_set').store = store;
					dj.byId('criterium_parameter_default_values_set').set('searchAttr', 'name');
				}
			},
			
			_fncGetParentWidget : function(widget)
			{
				//
				// Summary: Get parent widget
				//
				for(var p=widget.domNode.parentNode; p; p=p.parentNode){
					var id = p.getAttribute && p.getAttribute("widgetId");
					if(id){
						var parent = dj.byId(id);
						return parent;
					}
				}
				return null;
			},
			
			_fncDefaultAggregateColumnLabel : function(override)
			{
				//
				// Summary: Default the column label
				//
				console.debug('In m.defaultColumnLabel, override: ' + override);
				var columnValue = dj.byId('aggregate_column').get('value');
				var aggregateType = dj.byId('aggregate_type').get('value');
				if(columnValue != '' && aggregateType != '')
				{
					var columnLabelField = dj.byId('aggregate_label_' + language);
					if(columnLabelField.get('value') == '' || override)
					{
						var defaultLabel = arrColumn[columnValue][1] + ' (' + aggregateOperators[aggregateType] + ')';
						dj.byId('aggregate_label_' + language).set('value', defaultLabel);
					}
				}
			},
			
			_fncEnableReportExecutionDate : function(enable)
			{
				// Check/uncheck main radio button
				dj.byId('criterium_parameter_default_date_type_1').set("checked", enable);
				// Enable/disable fields
				dj.byId('criterium_parameter_default_date_report_exec_date_offset_1').set('disabled', !enable);
				dj.byId('criterium_parameter_default_date_report_exec_date_offset_2').set('disabled', !enable);
				dj.byId('criterium_parameter_default_date_report_exec_date_offset_days').set('disabled', !enable);
				
				if(dj.byId('criterium_parameter_default_date_report_exec_date_offset_1').get('checked')==false && dj.byId('criterium_parameter_default_date_report_exec_date_offset_2').get('checked')==false)
					{
					dj.byId('criterium_parameter_default_date_report_exec_date_offset_1').set('checked', true);
					}
				
				// Reset fields if not enabled
				if (!enable)
				{
					dj.byId('criterium_parameter_default_date_report_exec_date_offset_1').set('checked', false);
					dj.byId('criterium_parameter_default_date_report_exec_date_offset_2').set('checked', false);
					dj.byId('criterium_parameter_default_date_report_exec_date_offset_days').set('value', 0);
				}
			},
			
			_fncEnableFirstDayOfCurrentMonth : function(enable)
			{
				// Check/uncheck main radio button
				dj.byId('criterium_parameter_default_date_type_2').set("checked", enable);
				// Enable/disable fields
				dj.byId('criterium_parameter_default_date_first_day_of_month_offset_1').set('disabled', !enable);
				dj.byId('criterium_parameter_default_date_first_day_of_month_offset_2').set('disabled', !enable);
				dj.byId('criterium_parameter_default_date_first_day_of_month_offset_days').set('disabled', !enable);
				
				if(dj.byId('criterium_parameter_default_date_first_day_of_month_offset_1').get('checked')==false && dj.byId('criterium_parameter_default_date_first_day_of_month_offset_2').get('checked')==false)
					{
					dj.byId('criterium_parameter_default_date_first_day_of_month_offset_1').set('checked', true);
					}
				// Reset fields if not enabled
				if (!enable)
				{
					dj.byId('criterium_parameter_default_date_first_day_of_month_offset_1').set('checked', false);
					dj.byId('criterium_parameter_default_date_first_day_of_month_offset_2').set('checked', false);
					dj.byId('criterium_parameter_default_date_first_day_of_month_offset_days').set('value', 0);
				}
			},
			
			_fncEnableLastDayOfCurrentMonth : function(enable)
			{
				// Check/uncheck main radio button
				dj.byId('criterium_parameter_default_date_type_3').set("checked", enable);
				// Enable/disable fields
				dj.byId('criterium_parameter_default_date_last_day_of_month_offset_1').set('disabled', !enable);
				dj.byId('criterium_parameter_default_date_last_day_of_month_offset_2').set('disabled', !enable);
				dj.byId('criterium_parameter_default_date_last_day_of_month_offset_days').set('disabled', !enable);
				
				if(dj.byId('criterium_parameter_default_date_last_day_of_month_offset_1').get('checked')==false && dj.byId('criterium_parameter_default_date_last_day_of_month_offset_2').get('checked')==false)
					{
						dj.byId('criterium_parameter_default_date_last_day_of_month_offset_1').set('checked', true);
					}
				// Reset fields if not enabled
				if (!enable)
				{
					dj.byId('criterium_parameter_default_date_last_day_of_month_offset_1').set('checked', false);
					dj.byId('criterium_parameter_default_date_last_day_of_month_offset_2').set('checked', false);
					dj.byId('criterium_parameter_default_date_last_day_of_month_offset_days').set('value', 0);
				}
			},
			
			_fncEnableToday : function(enable)
			{
				// Check/uncheck main radio button
				dj.byId('criterium_parameter_default_date_type_4').set("checked", enable);
			},
			
			_fncEnableTomorrow : function(enable)
			{
				// Check/uncheck main radio button
				dj.byId('criterium_parameter_default_date_type_5').set("checked", enable);
			},
			
			_fncEnableYesterday : function(enable)
			{
				// Check/uncheck main radio button
				dj.byId('criterium_parameter_default_date_type_6').set("checked", enable);
			}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       

}

