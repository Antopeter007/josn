 /*jsl:ignoreall*/
//******************************************************************
// amdp js v2.0
// AM data protection js
// depends on am crypto js
// By i-Sprint
// Updated on 20120223
//******************************************************************

var amdp = {};
amdp.encrypt = function (cipherParams, publicKey, randomNumber, plaintext) {
	var params = {};
	if (typeof cipherParams == 'string') {
		try {
			params = JSON.parse(cipherParams);
		} catch (err) {
			amdp.log(err);
			throw err;
		}
	}
	
	if (typeof params.hash == 'undefined') {
		params.hash = false;
	}
	if (typeof params.hashAlgo == 'undefined' || params.hashAlgo.length == 0) {
		params.hashAlgo = 'SHA-256';
	}
	
	if (typeof params.symmetric == 'undefined') {
		params.symmetric = false;
	}
	if (typeof params.symmetricAlgo == 'undefined' || params.symmetricAlgo.length == 0) {
		params.symmetricAlgo = 'AES';
	}
	if (typeof params.symmetricKeyLength == 'undefined' || params.symmetricKeyLength == 0) {
		params.symmetricKeyLength = 128;
	}
	
	amdp.log(params.hash);
	amdp.log(params.hashAlgo);
	amdp.log(params.symmetric);
	amdp.log(params.symmetricAlgo);
	amdp.log(params.symmetricKeyLength);
	
	if (params.hash && params.symmetric && params.symmetricAlgo == 'AES') {
		return amdp._encrypt_aes_sha(params, publicKey, randomNumber, plaintext);
	}
	
	var modexp = publicKey.split(',',2);
	var bPlainText = amUtil.str2bin(plaintext);
	
	var bHash = [];
	if (params.hash) {
		bHash = amHash.sha256(bPlainText);
		amdp.log('hash=' + amUtil.hexEncode(bHash));
		bPlainText = bPlainText.concat(bHash);
	}
		
	var randomNumberArr = amUtil.hexDecode(randomNumber);
	bPlainText = bPlainText.concat(randomNumberArr);
	var rsaCipherText;
	try {
		rsaCipherText = amRsa.oaep.encryptAndGenLabel(modexp[0], modexp[1], bPlainText);
		amdp.log("rsaCipherText="+rsaCipherText);
	} catch (err) {
		amdp.log('Exception when encrypting using RSA-OAEP, msg='+err);
		throw err;
	}
	var ciphertext = rsaCipherText;
	return ciphertext;
		
}
amdp._encrypt_aes_sha = function (params, publicKey, randomNumber, plaintext) {
	var modexp = publicKey.split(',',2);
	var bPlainText = amUtil.str2bin(plaintext);
	var randomNumberArr = amUtil.hexDecode(randomNumber);
	amdp.log('modulus='+modexp[0]);
	amdp.log('modulusLength(bits)='+(modexp[0].length*8/2));
	amdp.log('exponent='+modexp[1]);
	amdp.log('rn='+randomNumber);
	
	var aesKey = new Array(params.symmetricKeyLength / 8);
	var rnd = new amUtil.SecureRandom();
	rnd.nextBytes (aesKey);
	
	var iv = new Array(16);
	rnd = new amUtil.SecureRandom();
	rnd.nextBytes (iv);
	
	var bSymCipherText;
	var symCipherText;
	try {
		bSymCipherText = amAes.CbcPkcs7.encrypt(bPlainText, aesKey, iv);
		symCipherText = amUtil.hexEncode(bSymCipherText);
		amdp.log('symCipherText='+symCipherText);
	} catch (err) {
		amdp.log('Exception when encrypting using AES, msg='+err);
		throw err;
	}
	
	var dataForHash = iv.concat(bSymCipherText);
	var bHash;
	try {
		bHash = amHash.sha256(dataForHash);
		var hash = amUtil.hexEncode(bHash)
		amdp.log('hash='+hash);
	} catch (err) {
		amdp.log('Exception when generating hash, msg='+err);
		throw err;
	}
	
	var bAsymPlainText = aesKey;
	bAsymPlainText = bAsymPlainText.concat(bHash);
	bAsymPlainText = bAsymPlainText.concat(randomNumberArr);
	bAsymPlainText = bAsymPlainText.concat(iv);
	var asymCipherText;
	try {
		asymCipherText = amRsa.oaep.encryptAndGenLabel(modexp[0], modexp[1], bAsymPlainText);
		amdp.log("rsaCipherText="+asymCipherText);
		var labelCipherText = asymCipherText.split(':',2);
		var label = labelCipherText[0];
		asymCipherText = labelCipherText[1];
	} catch (err) {
		amdp.log('Exception when encrypting using RSA-OAEP, msg='+err);
		throw err;
	}
	
	var cipherText = '02';
	cipherText = cipherText.concat(amUtil.hexEncode(amUtil.int2bin(label.length/2,1)));
	cipherText = cipherText.concat(label);
	cipherText = cipherText.concat(amUtil.hexEncode(amUtil.int2bin(asymCipherText.length/2,2)));
	cipherText = cipherText.concat(asymCipherText);
	cipherText = cipherText.concat(symCipherText);
	return cipherText;
}

amdp.multivalues = new Array();
amdp.addValue = function (value) {
	amdp.multivalues[amdp.multivalues.length] = value;
}
amdp.clearMultiValues = function (value) {
	amdp.multivalues.splice(amdp.multivalues.length);
	amdp.multivalues = new Array();
}
amdp.encryptMultiValues = function (cipherParams, publicKey, randomNumber) {
	var plaintext=JSON.stringify(amdp.multivalues);
	return amdp.encrypt(cipherParams, publicKey, randomNumber, plaintext);
}
amdp.log = function(log) {
	try {
		document.testform.debug.value = document.testform.debug.value + log +'\n';
	} catch (err) {
		
	}
}