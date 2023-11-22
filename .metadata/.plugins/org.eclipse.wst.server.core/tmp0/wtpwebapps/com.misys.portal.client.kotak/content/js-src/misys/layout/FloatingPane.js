dojo.provide("misys.layout.FloatingPane");
dojo.experimental("misys.layout.FloatingPane"); 

/**
 * Collaboration Floating Window
 */
dojo.require("dojox.layout.FloatingPane");
dojo.require("dojo.fx");
dojo.require("dojo.cache");

// our declared class
dojo.declare("misys.layout.FloatingPane",
        // we inherit from this class, which in turn mixes
        // in _Templated and _Layout
        [ dojox.layout.FloatingPane ],
        // class properties:
        {

		templateString: dojo.cache("misys.layout", "resources/CollaborationFloatingPane.html"),
        
        // Whether the window is open or collapsed by default
        open: false,
        
        // Whether the window is pinned or floating by default 
        pinned: true,
        
        // Variable to hold the event reference for the pin button
        _pinnedReference: null,
        
        // Current size of the window
        _windowHeight: null,

        // duration: Integer
    	//		Time in milliseconds to fade in/fade out
    	duration: dijit.defaultDuration,
    	
    	_blankGif: misys.getContextualURL("/content/js/dojo/resources/blank.gif"),
    	
    	postCreate: function(){
    		this.inherited(arguments);

    		this.moveable = new dojo.dnd.move.parentConstrainedMoveable(
    	            this.domNode, {
    	                handle: this.focusNode,
    	                constraints: {
    	                        l: 0,
    	                        t: 20,
    	                        w: window.innerWidth,
                                h: window.innerHeight                            
    	                    },
    	                within: true
    	            }
    	        );
    		
    		var collabContentNode = this.collabContentNode,
    			floatingWindow = this.floatingWindow;
    		
    		if(this.open) {
    			collabContentNode.style.height = "auto"; //"150px";
    			floatingWindow.style.height = "auto";
    			dojo.style(this.domNode, "height", "auto");
    		} else {
    			collabContentNode.style.display = "none";
    			dojo.style(this.domNode, "height", "30px");
    		}
    		
    		this._setCss();
    		dojo.setSelectable(this.titleNode, false);
    		dijit.setWaiState(this.containerNode, "labelledby", this.titleNode.id);
    		dijit.setWaiState(this.focusNode, "haspopup", "true");

    		this._showPanes = function(){
    			collabContentNode.style.height = "auto"; //this._windowHeight + "px";
    			floatingWindow.style.height = "auto";
    		};
    		this._hidePanes = function(){
    			this._windowHeight = dojo.style('collaborationWindowContent', 'height');
    			floatingWindow.style.height = "auto";
    			collabContentNode.style.height = "0";
    		};
    		
    		if(!dojo.isIE || dojo.isIE > 6) {
	    		this._fadeOut = dojo.fadeOut({
	    			node: collabContentNode,
	    			duration: this.duration,
	    			onEnd: function(){
	    				collabContentNode.style.display = "none";	
	    			}
	    		});
    		} else {
    			this._fadeOut = function() {
    				collabContentNode.style.display = "none";
    			};
    		}
    		// setup open/close animations
    		if(!dojo.isIE || dojo.isIE > 6) {
    			this._fadeIn = dojo.fadeIn({
        			node: collabContentNode,
        			duration: this.duration,
        			beforeBegin: function(){
        				collabContentNode.style.display = "inherit";
        			}
        		});
    		} else {
    			this._fadeIn = function() {
    				collabContentNode.style.display = "block";
    			};
    		}
    		
    		// Initialise the pin
    		this.pin();
    	},
    	
    	toggle: function(){
    		// summary:
    		//		Switches between opened and closed state
    		// tags:
    		//		private
    		
//    		dojo.forEach([this._wipeIn, this._wipeOut], function(animation){
//    			if(animation && animation.status() == "playing"){
//    				animation.stop();
//    			}
//    		});

    		var fadeAnim = this[this.open ? "_fadeOut" : "_fadeIn"];
    		var hideAnim = this[this.open ? "_hidePanes" : "_showPanes"];
    		if(fadeAnim && hideAnim){
    			hideAnim();
    			if(fadeAnim.play) {
    				fadeAnim.play();
    			} else {
    				fadeAnim();
    			}
    			
    		}else{
    			this.collabContentNode.style.display = this.open ? "" : "none";
    		}
    		this.open = !(this.open);

    		// load content (if this is the first time we are opening the TitlePane
    		// and content is specified as an href, or href was set when hidden)
    		this._onShow();
    		this._setCss();
    	},

    	pin: function(){
    		// summary:
    		//		Pins the window in position, or allows it to move as the user scrolls
    		// tags:
    		//		private
    		if(!this.pinned)
    		{
    			this.pinNode.style.background = "url('"+misys.getContextualURL('/content/images/pic_pinup.gif')+"')";
    			this._pinnedReference = dojo.connect(window, 'onscroll', this, "_positionWindow");
    			misys.connections.push(this._pinnedReference);
    		}
    		else
    		{
    			this.pinNode.style.background = "url('"+misys.getContextualURL('/content/images/pic_pindown.gif')+"')";
    			if(this._pinnedReference) {
    				dojo.disconnect(this._pinnedReference);
    			}
    		}
    		
    		this.pinned = ! this.pinned;
    	},
    	
    	resize: function(/* Object */dim){
    		// summary: Size the FloatingPane and place accordingly
    		dim = dim || this._naturalState; //dojo.coords(this.domNode); //dim || this._naturalState;
    		this._currentState = dim;
    		// From the ResizeHandle we only get width and height information
    		var dns = this.domNode.style;

    		var c = dojo.coords(this.domNode);

    		if("t" in dim){ dns.top = c.t + "px"; }
    		if("l" in dim){ dns.left = c.l + "px"; }
    		dns.width = dim.w + "px";
    		dns.height = (this.open) ? dim.h + "px" : "auto";

    		// Now resize canvas (unless the pane is closed)
    		var height = (this.open) ? (dim.h - this.focusNode.offsetHeight) : 0;

    		var mbCanvas = { l: 0, t: 0, w: dim.w, h: height };
    		dojo.marginBox(this.canvas, mbCanvas);

    		// If the single child can resize, forward resize event to it so it can
    		// fit itself properly into the content area
    		this._checkIfSingleChild();
    		if(this._singleChild && this._singleChild.resize){
    			this._singleChild.resize(mbCanvas);
    		}
    	},
    	
    	bringToTop: function(){
    		return;
    	},
    	
    	_config : {
    		timer : null,
    		heightOffset : null
    	},
    	
    	_positionWindow: function(){
    		// summary:
    		//		Position the window with reference to the viewport and scrollbar.
    		// tags:
    		//		private
    		
    		// Give some time for scrollbars to appear/disappear
    		if(this._config.timer){
    			clearTimeout(this.timer);
    		}
    		if(!this._config.heightOffset) {
    			var headers = dojo.query(".header");
    			this._config.heightOffset = (headers.length === 1) ?
    										dojo.coords(headers[0]).h : 0;
    		}
    		
    		var viewport = dijit.getViewport(),
				floatingWindow = this.domNode;
			this.timer = setTimeout(dojo.hitch(this, function(){
				dojo.fx.slideTo({ 
					node: floatingWindow,
					top: viewport.t + (floatingWindow.offsetHeight/2) + this._config.heightOffset,
					right: floatingWindow.style.right,
					left: floatingWindow.style.left,
					unit: "px" }).play();
			}), 300);	
    	},
    	
    	_setCss: function(){
    		// summary:
    		//		Set the open/close css state for the TitlePane
    		// tags:
    		//		private

    		var classes = ["dijitClosed", "dijitOpen"];
    		var boolIndex = this.open;
    		var node = this.titleBarNode || this.focusNode;
    		dojo.removeClass(node, classes[!boolIndex+0]);
    		node.className += " " + classes[boolIndex+0];

    		// provide a character based indicator for images-off mode
    		this.arrowNodeInner.innerHTML = this.open ? "-" : "+";
    	}
       }
);