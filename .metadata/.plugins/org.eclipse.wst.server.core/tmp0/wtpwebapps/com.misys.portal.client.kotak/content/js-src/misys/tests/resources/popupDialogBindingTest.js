dojo.provide("misys.tests.resources.popupDialogBindingTest");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	d.mixin(m.dialog, {
		bind: function(){
			BINDING_CALLED = true;
		}
	});
})(dojo, dijit, misys);