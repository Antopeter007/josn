dojo.provide("misys.report.widget.Product");
dojo.experimental("misys.report.widget.Product"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");
dojo.require("misys.layout.SimpleItem");

// our declared class
dojo.declare("misys.report.widget.Product",
		[ dijit._Widget, dijit._Contained, misys.layout.SimpleItem ],
        // class properties:
        {
        
		product: ''

       }
);