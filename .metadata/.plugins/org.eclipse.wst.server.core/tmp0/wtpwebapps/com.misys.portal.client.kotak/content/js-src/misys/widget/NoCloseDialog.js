dojo.provide("misys.widget.NoCloseDialog");
dojo.experimental("misys.widget.NoCloseDialog"); 

dojo.require("dijit.Dialog");

//Copyright (c) 2000-2011 Misys (http://www.misys.com),
//All Rights Reserved. 
//
//summary:
//Dialog without close button and without esc key
//
//description:
//This is an extension of the dojo Dialog that makes possible to disable the esc
//key and hides the close button, forcing the user to close the dialog programmatically.
//The content in this dialog *must* provide a close button, or other way to get
//out of it
//
//version:   1.0
//date:      31/10/2011
//author:    Mauricio Moura da Silva
dojo.declare("misys.widget.NoCloseDialog", [dijit.Dialog],
{
    noCloseButton: true,
    _changeNoCloseButton: function()
    {
    	dojo.style(this.closeButtonNode, "display", this.noCloseButton ? "none" : "block");
    },
    postCreate: function()
    {
    	this.inherited(arguments);
    	this._changeNoCloseButton();
    },
    _onKey: function(event)
    {
    	if(this.noCloseButton && event.charOrCode == dojo.keys.ESCAPE) 
    		{
    			return;
    		}
    	this.inherited(arguments);
    },
    setNoCloseButton: function(blnFlag)
    {
    	this.noCloseButton = blnFlag;
    	this._changeNoCloseButton();
    }
});