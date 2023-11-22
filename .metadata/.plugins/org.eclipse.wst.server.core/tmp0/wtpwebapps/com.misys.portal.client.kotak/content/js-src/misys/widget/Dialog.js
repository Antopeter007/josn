dojo.provide("misys.widget.Dialog");
dojo.experimental("misys.widget.Dialog"); 

dojo.require("dijit.Dialog");

//Copyright (c) 2000-2013 Misys (http://www.misys.com),
//All Rights Reserved. 
//
//description:
//This is an extension of the dojo Dialog that makes possible to disable the esc
//key on all dialogs.
//
//version:   1.0
//date:      30/12/2013
dojo.declare("misys.widget.Dialog", [dijit.Dialog],
{
    _onKey: function(event)
    {
    	  var key 	= event.keyCode || event.charCode; 
	      var k 	= dojo.keys; 
	      if (key == k.ESCAPE) { 
        	 event.preventDefault();
		     dojo.stopEvent(event);
	      }
	      else
    	  {
	    	  this.inherited(arguments);  
    	  }
    },
    onLoad: function(){
    	this.inherited(arguments);
    },
    onCancel: function(){
        document.body.style.overflow = "visible";
    },
    show: function() {
    var style = body.style;
    	style.overflow ="hidden";
    	 if(!window.isAccessibilityEnabled) {
    		this.inherited(arguments);
     		return;
     	}
    	
    	if(window.isAccessibilityEnabled){
    		if(dojo.query(".errorDialog", this.domNode) && dojo.query(".errorDialog", this.domNode).length>0){
	    		dojo.attr(dojo.query(".errorDialog", this.domNode)[0],'role','alert');
	    		dojo.attr(dojo.query("#alertDialog_title", this.domNode)[0],'role','alert');
	    	}
    		if(dojo.query(".informationDialog", this.domNode) && dojo.query(".informationDialog", this.domNode).length>0)
	        {
    			dojo.attr(dojo.query(".informationDialog", this.domNode)[0],'role','alert');
 	            dojo.attr(dojo.query("#alertDialog_title", this.domNode)[0],'role','alert');
	        }
    		if(dojo.query("#okButton", this.domNode) && dojo.query("#okButton", this.domNode).length>0 && dojo.query("#alertDialogContent", this.domNode) && dojo.query("#alertDialogContent", this.domNode).length>0){
				dojo.attr(dojo.query("#okButton", this.domNode)[0],'aria-describedby','alertDialogContent');
			} 
			
    		dojo.query('.dijitButtonNode',this.domNode).forEach(function(btnNode){
				dojo.attr(btnNode,'role','application');
			});

    	}
    	this.inherited(arguments);
    	   	
    },
    _getFocusItems: function(){
    	this.inherited(arguments);
    	var style = body.style;
    	style.overflow ="hidden";
    	if(this.closeButtonNode) {
    		if (dojo.style(this.closeButtonNode, 'display') !== 'none') {
    			this._firstFocusItem = this.closeButtonNode;
    		}
    	} 	
	},
	_onBlur: function(by){
	 var style = body.style;
    	style.overflow ="";
        this.inherited(arguments);
        if(!window.isAccessibilityEnabled) {
    		return;
    	}
       
        // If focus was accidentally removed from the dialog, such as if the user clicked a blank
        // area of the screen, or clicked the browser's address bar and then tabbed into the page,
        // then refocus.   Won't do anything if focus was removed because the Dialog was closed, or
        // because a new Dialog popped up on top of the old one.
        var refocus = dojo.hitch(this, function(){
        		if(this.open && !this._destroyed && dijit._DialogLevelManager.isTop(this)){
                        this._getFocusItems(this.domNode);
                        dijit.focus(this._firstFocusItem);
                }
        });
        if(by == "mouse"){
        	/** To Fix Screen Freeze issue MPS-49299. **/
        	if(dojo.isChrome || dojo.isFF || dojo.isMozilla) {
    			style.overflow ="auto";
    		}else{
    			style.overflow ="hidden";
    		}
            // wait for mouse up, and then refocus dialog; otherwise doesn't work
            //on.once(this.ownerDocument, "mouseup", refocus);
        	var reFocusConnect = dojo.connect(this.ownerDocument,"mouseup", refocus);
        	dojo.disconnect(reFocusConnect);
        }else{
            refocus();
        }
	}
});