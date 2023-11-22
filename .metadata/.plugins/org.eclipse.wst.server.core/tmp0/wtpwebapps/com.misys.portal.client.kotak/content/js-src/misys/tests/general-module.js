dojo.provide("misys.tests.general-module");

try{
	var userArgs = window.location.search.replace(/[\?&](dojoUrl|testUrl|testModule)=[^&]*/g,"").replace(/^&/,"?");

	doh.registerUrl("misys.tests._base", 
			dojo.moduleUrl("misys", "tests/_base.html" + userArgs));
	doh.registerUrl("misys.tests._base_dialogs", 
			dojo.moduleUrl("misys", "tests/_base_dialogs.html" + userArgs));
	doh.registerUrl("misys.tests.common", 
			dojo.moduleUrl("misys", "tests/common.html" + userArgs));
	doh.registerUrl("misys.tests.common_dialogs", 
			dojo.moduleUrl("misys", "tests/common_dialogs.html" + userArgs));
	doh.registerUrl("misys.tests.form.common", 
			dojo.moduleUrl("misys", "tests/form/common.html" + userArgs));
	doh.registerUrl("misys.tests.form.file", 
			dojo.moduleUrl("misys", "tests/form/file.html" + userArgs));
	doh.registerUrl("misys.tests.grid._base", 
			dojo.moduleUrl("misys", "tests/grid/_base.html" + userArgs));
	doh.registerUrl("misys.tests.validation.common", 
			dojo.moduleUrl("misys", "tests/validation/common.html" + userArgs));
}catch(e){
	doh.debug(e);
}