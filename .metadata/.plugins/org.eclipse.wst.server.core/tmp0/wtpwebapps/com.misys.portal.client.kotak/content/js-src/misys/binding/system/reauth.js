dojo.provide("misys.binding.system.reauth");
dojo.require("misys.validation.common");

(function( /* Dojo */d,
/* Dijit */dj,
/* Misys */m) {

	"use strict"; // ECMA5 Strict Mode

	//
	// Private functions & variables
	//
	var _reauthDialogID = "reauth_dialog";

	function SHA256(s) {

		var chrsz = 8;
		var hexcase = 0;

		function safe_add(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		function S(X, n) {
			return (X >>> n) | (X << (32 - n));
		}
		function R(X, n) {
			return (X >>> n);
		}
		function Ch(x, y, z) {
			return ((x & y) ^ ((~x) & z));
		}
		function Maj(x, y, z) {
			return ((x & y) ^ (x & z) ^ (y & z));
		}
		function Sigma0256(x) {
			return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
		}
		function Sigma1256(x) {
			return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
		}
		function Gamma0256(x) {
			return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
		}
		function Gamma1256(x) {
			return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
		}

		function core_sha256(m, l) {
			var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
					0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98,
					0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE,
					0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6,
					0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
					0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3,
					0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138,
					0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E,
					0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
					0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116,
					0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
					0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814,
					0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
			var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372,
					0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
			var W = new Array(64);
			var a, b, c, d, e, f, g, h, i, j;
			var T1, T2;

			m[l >> 5] |= 0x80 << (24 - l % 32);
			m[((l + 64 >> 9) << 4) + 15] = l;

			for ( var x = 0; x < m.length; x += 16) {
				a = HASH[0];
				b = HASH[1];
				c = HASH[2];
				d = HASH[3];
				e = HASH[4];
				f = HASH[5];
				g = HASH[6];
				h = HASH[7];

				for ( var y = 0; y < 64; y++) {
					if (y < 16)
					{
						W[y] = m[y + x];
					}
					else
					{
						W[y] = safe_add(safe_add(safe_add(Gamma1256(W[y - 2]),W[y - 7]), Gamma0256(W[y - 15])), W[y - 16]);
					}
						
					T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)),Ch(e, f, g)), K[y]), W[y]);
					T2 = safe_add(Sigma0256(a), Maj(a, b, c));

					h = g;
					g = f;
					f = e;
					e = safe_add(d, T1);
					d = c;
					c = b;
					b = a;
					a = safe_add(T1, T2);
				}

				HASH[0] = safe_add(a, HASH[0]);
				HASH[1] = safe_add(b, HASH[1]);
				HASH[2] = safe_add(c, HASH[2]);
				HASH[3] = safe_add(d, HASH[3]);
				HASH[4] = safe_add(e, HASH[4]);
				HASH[5] = safe_add(f, HASH[5]);
				HASH[6] = safe_add(g, HASH[6]);
				HASH[7] = safe_add(h, HASH[7]);
			}
			return HASH;
		}

		function str2binb(str) {
			var bin = Array();
			var mask = (1 << chrsz) - 1;
			for ( var i = 0; i < str.length * chrsz; i += chrsz) {
				bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
			}
			return bin;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for ( var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		}

		function binb2hex(binarray) {
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for ( var i = 0; i < binarray.length * 4; i++) {
				str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
			}
			return str;
		}

		s = Utf8Encode(s);
		return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

	}

	function _processShaValue(sha256_value) {
		var esignDigits = ("" + sha256_value + "").replace(/[^\d]/g, '');
		esignDigits = esignDigits.split('').reverse().join('');// reverse this
		if (esignDigits.length >= 8)
		{
			esignDigits = esignDigits.substring(0, 8);
		}
		return esignDigits;
	}

	

	function _generateESIGNFeild(es_field){
		var esignDigits = (""+es_field+"").replace(/[^\d]/g, '');
		
		if (esignDigits.length == 0)
		{
			return "0000";
		}
		else if (esignDigits.length == 1)
		{
			return "000" + esignDigits;
		}
		else if (esignDigits.length == 2)
		{
			return "00" + esignDigits;
		}
		else if (esignDigits.length == 3)
		{
			return "0" + esignDigits;
		}
		else if ((esignDigits.length >= 4) && (esignDigits.length < 8))
		{
			return esignDigits;
		}
		else
		{
			// this means length()>=8
			return esignDigits.substring(0, 8);
			
		}
	}
	
	function _cancelReAuth(dialog){
		
		dialog.hide();
		// Destroy all previous widgets and containers
		var widgets = dj.findWidgets(dojo.byId("reauth_dialog_content"));
		dojo.forEach(widgets, function(w) {
			w.destroyRecursive(false);
		});

		// Destroy all the Children
		dojo.empty("reauth_dialog_content");
		var realformOperation = dj.byId("realform_operation");
		if(realformOperation && realformOperation.get("value") !== "") {
			realformOperation.set("value", "");
		}
		if(dj.byId("alertDialog")){
		dj.byId("alertDialog").hide();
		}
	}

	d.mixin(m._config, {
	addESFields : function(es_field1, es_field2) {
		if (dj.byId("es_field1")) {
			dj.byId("es_field1").set("value",  _generateESIGNFeild(es_field1));		
			dojo.byId("es_field1_value").innerHTML = _generateESIGNFeild(es_field1);
		}
		if (dj.byId("es_field2")) {
			dj.byId("es_field2").set("value",  _generateESIGNFeild(es_field2));
			dojo.byId("es_field2_value").innerHTML = _generateESIGNFeild(es_field2);
		}
	},
	
	getESIGNFeildForBulk : function(json_array) {
		var strToHash = "";
		for ( var i = 0; i < json_array.length; i++) {
			var v1 = json_array[i].esf1_amount;
			var v2 = json_array[i].esf2_account;
			var strToHash_part = v1 + "" + v2;
			strToHash_part = ("" + strToHash_part + "").replace(/[^\d]/g, '');
			strToHash = strToHash + "" + strToHash_part;
		}
		
		var sha256_value = SHA256(strToHash);
		return _processShaValue(sha256_value);
	}
	
	});

	// Onload/Unload/onWidgetLoad Events
	d.subscribe("ready", function() {
		var dialog = dj.byId(_reauthDialogID);
		m.setValidation('reauth_password', m.validatePassword);
		if(dialog)
		{
			var pwd = dj.byId("reauth_password");
			m.dialog.connect(dialog, "onShow", function() {
			if(m._config.reauth_otp_response_valid && m._config.reauth_otp_response_valid === true)
			{
				pwd.set("required", true);
			}
		});

		m.dialog.connect(dialog, "onHide", function() {
			pwd.set("value", "");
			pwd.set("required", false);
		});
		
		m.dialog.connect(dialog, "onKeyPress", function(evt) {
			if (evt.keyCode == d.keys.ESCAPE) {
				d.stopEvent(evt);
				_cancelReAuth(dialog);
			}
		});
		
		m.dialog.connect("doReauthentication", "onClick", function() {			
			if (dialog.validate()) {
		
				//If it is not a normal 'realform' for submission
				//that means multiple submission from ListDef screen or action from normal list screen
			    if(d.isFunction(m._config.reauthSubmit))
			    {   dialog.hide();
			    	m._config.reauthSubmit();
			    }
			    else{
			    	
					var valueToEE = dj.byId("reauth_password")? dj.byId("reauth_password").get("value") : '';
					var encValue = valueToEE;
					encValue = amdp.encrypt('{\"hash\":false}', dj.byId(
							"ra_e2ee_pubkey").get("value"), dj.byId(
							"ra_e2ee_server_random").get("value"), valueToEE);
	
					dj.byId("reauth_otp_response").set("value", encValue);
					dj.byId("reauth_e2ee_pubkey").set("value",
							dj.byId("ra_e2ee_pubkey").get("value"));
					dj.byId("reauth_e2ee_server_random").set("value",
							dj.byId("ra_e2ee_server_random").get("value"));
					dj.byId("reauth_e2ee_pki").set("value",
							dj.byId("ra_e2ee_pki").get("value")); 
	
					dj.byId("TransactionData").set("value", m.formToXML());
					dialog.hide();
					dj.byId("realform").submit();
					
			    }
			}
		}, _reauthDialogID);
		
		m.dialog.connect("cancelReauthentication", "onClick", function() {
			
			_cancelReAuth(dialog);
			
		
		}, _reauthDialogID);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.reauth_client');