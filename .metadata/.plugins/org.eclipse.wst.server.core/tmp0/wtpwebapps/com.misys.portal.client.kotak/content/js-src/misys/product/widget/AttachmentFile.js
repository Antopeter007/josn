dojo.provide("misys.product.widget.AttachmentFile");
dojo.experimental("misys.product.widget.AttachmentFile"); 

dojo.require("dijit._Contained");
dojo.require("dijit._Widget");

// our declared class
dojo.declare("misys.product.widget.AttachmentFile",
		[ dijit._Widget, dijit._Contained ],
        // class properties:
        {
        
		attachment_id: '',
		file_type: '',
		file_title: '',
		file_name: '',
		file_status: '',
		file_status_decoded: '',
		file_access_dttm: '',
		file_description: '',
		fileact: ''

       }
);