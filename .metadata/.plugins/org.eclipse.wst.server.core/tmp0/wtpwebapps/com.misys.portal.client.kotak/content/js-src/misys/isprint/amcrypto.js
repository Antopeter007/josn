 /*jsl:ignoreall*/
//******************************************************************
// AM crypto js v2.0
// By i-Sprint
// Updated on 20120223
//******************************************************************

var amHash = {};

//******************************************************************
// SHA2
//******************************************************************
/* A JavaScript implementation of the Secure Hash Standard
 * Version 0.3 Copyright Angel Marin 2003-2004 - http://anmar.eu.org/
 * Distributed under the BSD License
 * Some bits taken from Paul Johnston's SHA-1 implementation
 */

amHash.safe_add = function (x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

amHash.sha2_S = function (X, n) {return ( X >>> n ) | (X << (32 - n));}

amHash.sha2_R = function (X, n) {return ( X >>> n );}

amHash.sha2_Ch = function (x, y, z) {return ((x & y) ^ ((~x) & z));}

amHash.sha2_Maj = function (x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}

amHash.sha2_Sigma0256 = function (x) {return (amHash.sha2_S(x, 2) ^ amHash.sha2_S(x, 13) ^ amHash.sha2_S(x, 22));}

amHash.sha2_Sigma1256 = function (x) {return (amHash.sha2_S(x, 6) ^ amHash.sha2_S(x, 11) ^ amHash.sha2_S(x, 25));}

amHash.sha2_Gamma0256 = function (x) {return (amHash.sha2_S(x, 7) ^ amHash.sha2_S(x, 18) ^ amHash.sha2_R(x, 3));}

amHash.sha2_Gamma1256 = function (x) {return (amHash.sha2_S(x, 17) ^ amHash.sha2_S(x, 19) ^ amHash.sha2_R(x, 10));}

amHash.core_sha256 = function (m, l) {
    var K = new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    /* append padding */
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for ( var i = 0; i<m.length; i+=16 ) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        for ( var j = 0; j<64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = amHash.safe_add(amHash.safe_add(amHash.safe_add(amHash.sha2_Gamma1256(W[j - 2]), W[j - 7]), amHash.sha2_Gamma0256(W[j - 15])), W[j - 16]);

            T1 = amHash.safe_add(amHash.safe_add(amHash.safe_add(amHash.safe_add(h, amHash.sha2_Sigma1256(e)), amHash.sha2_Ch(e, f, g)), K[j]), W[j]);
            T2 = amHash.safe_add(amHash.sha2_Sigma0256(a), amHash.sha2_Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = amHash.safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = amHash.safe_add(T1, T2);
        }
        
        HASH[0] = amHash.safe_add(a, HASH[0]);
        HASH[1] = amHash.safe_add(b, HASH[1]);
        HASH[2] = amHash.safe_add(c, HASH[2]);
        HASH[3] = amHash.safe_add(d, HASH[3]);
        HASH[4] = amHash.safe_add(e, HASH[4]);
        HASH[5] = amHash.safe_add(f, HASH[5]);
        HASH[6] = amHash.safe_add(g, HASH[6]);
        HASH[7] = amHash.safe_add(h, HASH[7]);
    }
    return HASH;
}


amHash.sha256 = function (data) {
	return amUtil.dword2byte(amHash.core_sha256(amUtil.byte2dword(data), data.length*8));
}

//******************************************************************
// SHA1
//******************************************************************
amHash.encodeSHA1 = function (dataByte){
	var SHA1_BLOCKSIZE = 64;
	var dataByteLen = dataByte.length;
	var dataByteIndex = dataByteLen;
	
	// Pad the dataByte
	var zeroPadLength = (64 - ((dataByteLen + 1 + 8) % 64)) % 64;
	dataByte[dataByteIndex] = 0x80;
	dataByteIndex ++;
	for (var i = 0; i < zeroPadLength; i ++, dataByteIndex ++){
		dataByte[dataByteIndex] = 0x00;
	}
	
	// Convert the dataByte length from bytes to bits, and then add the 8-bytes representation of dataByte Length
	dataByteLen = dataByteLen * 8;
	for (var i = 7; i >= 0; i --){
		dataByte[dataByteIndex+i] = (dataByteLen%256) & 0xFF;
		dataByteLen = dataByteLen / 256;
	}
		
	// Initialize variables
	var h0 = 0x67452301;
	var h1 = 0xEFCDAB89;
	var h2 = 0x98BADCFE;
	var h3 = 0x10325476;
	var h4 = 0xC3D2E1F0;
	
	var A,B,C,D,E, temp;
	
	var maxSHA1Chunk = dataByte.length / SHA1_BLOCKSIZE;
	
	for (var sha1ChunkIndex = 0; sha1ChunkIndex < maxSHA1Chunk; sha1ChunkIndex ++){
		var W = [];
		
		for (var WIndex = 0, convertIndex = (sha1ChunkIndex * SHA1_BLOCKSIZE); WIndex < SHA1_BLOCKSIZE / 4; WIndex ++){
			W[WIndex] = amUtil.byte2dword(dataByte.slice(convertIndex, convertIndex + 4));
			convertIndex = convertIndex + 4;
		}
		
		for (var i = 16; i <= 79; i ++){
			W[i] = amHash.rotateLeft(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
		}
		
		//Initialize hash value for this chunk:
		A = h0
	    B = h1
	    C = h2
	    D = h3
	    E = h4
		
		for (var i = 0; i <= 19; i ++){
			temp = amHash.safe_add(amHash.safe_add(amHash.rotateLeft(A,5), ((B&C) | (~B&D))),amHash.safe_add(amHash.safe_add(E,W[i]),0x5A827999)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = amHash.rotateLeft(B,30);
			B = A;
			A = temp;
		}

		for(var i=20; i<=39; i++ ) {
			temp = amHash.safe_add(amHash.safe_add(amHash.rotateLeft(A,5),(B ^ C ^ D)),amHash.safe_add(amHash.safe_add(E,W[i]), 0x6ED9EBA1)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = amHash.rotateLeft(B,30);
			B = A;
			A = temp;
		}

		for(var i=40; i<=59; i++ ) {
			temp = amHash.safe_add(amHash.safe_add(amHash.rotateLeft(A,5),((B&C) | (B&D) | (C&D))),amHash.safe_add(amHash.safe_add(E,W[i]),0x8F1BBCDC)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = amHash.rotateLeft(B,30);
			B = A;
			A = temp;
		}

		for(var i=60; i<=79; i++ ) {
			temp = amHash.safe_add(amHash.safe_add(amHash.rotateLeft(A,5), (B ^ C ^ D)), amHash.safe_add(amHash.safe_add(E, W[i]), 0xCA62C1D6)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = amHash.rotateLeft(B,30);
			B = A;
			A = temp;
		}
		
		h0 = amHash.safe_add(h0, A) & 0x0FFFFFFFF;
		h1 = amHash.safe_add(h1, B) & 0x0FFFFFFFF;
		h2 = amHash.safe_add(h2, C) & 0x0FFFFFFFF;
		h3 = amHash.safe_add(h3, D) & 0x0FFFFFFFF;
		h4 = amHash.safe_add(h4, E) & 0x0FFFFFFFF;
	}
	
	var sha1Result = [];
	
	sha1Result = amUtil.dword2byte([h0, h1, h2, h3, h4]);
	
	return sha1Result;
}

amHash.rotateLeft = function (X,n) {
	var rotated = ( X<<n ) | (X>>>(32-n));
	return rotated;
}

//******************************************************************
// RSA
//******************************************************************
var amRsa = {};

// "empty" RSA key constructor
amRsa.RSAKey = function () {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
amRsa.RSASetPublic = function (N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = amUtil.parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else {
    throw "Invalid RSA public key";
  }
}

// Perform raw public operation on "x": return x^e (mod n)
amRsa.RSADoPublic = function (x) {
	var y = x.modPowInt(this.e, this.n);
	return y;
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
amRsa.RSAEncrypt = function (m) {
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// protected
amRsa.RSAKey.prototype.doPublic = amRsa.RSADoPublic;

// public
amRsa.RSAKey.prototype.setPublic = amRsa.RSASetPublic;
amRsa.RSAKey.prototype.encrypt = amRsa.RSAEncrypt;


//******************************************************************
// OAEP
//******************************************************************
amRsa.oaepEncode = function (digestLen, key_len, label, message){
	// Check for message length
	var mLen = message.length;
	if (mLen > (key_len - (2*digestLen) - 2)){
		throw 'The message to be encrypted is too long';
	}

	// Generate the '0' pad octet
	var padString = [];
	var padStringLength = key_len - mLen - (2*digestLen) - 2;
	for (var i = 0; i < padStringLength; i ++){
		padString[i] = 0x00;
	}
	
	// generate label hash
	var lHash = amHash.encodeSHA1(label);
	// Create the data block
	var dataBlock = [];
	dataBlock = dataBlock.concat (lHash, padString, 0x01, message);
	// Generate the seed
	var seed = amUtil.generateRandom(digestLen);
	// Generate the dbMask
	var dbMask = amRsa.PKCS1_MGF1(digestLen, key_len - digestLen - 1, seed);
	// Masked the datablock
	var maskedDb = amUtil.xor(dataBlock, dbMask);
	// Generate the seedMask
	var seedMask = amRsa.PKCS1_MGF1(digestLen, digestLen, maskedDb);
	// Masked the seed
	var maskedSeed = amUtil.xor(seed, seedMask);
	
	//Final result
	var encodedMessage = [0x00].concat (maskedSeed, maskedDb);
	return encodedMessage;
}

amRsa.PKCS1_MGF1 = function (digestLen, maskLen, seed)	{
	
	var cnt = [];		// In 8 bit format.	
	var mgfResult = [];
	var temp = [];
	var mgfIndex = 0;
	
	for (var i = 0; mgfIndex < maskLen; i++){
		cnt[0] = ((i >> 24) & 255);
		cnt[1] = ((i >> 16) & 255);
		cnt[2] = ((i >> 8)) & 255;
		cnt[3] = (i & 255);
		
		var message = seed.concat(cnt);
		temp = amHash.encodeSHA1 (message);
		
		for (var j = 0; j < temp.length && mgfIndex < maskLen; j ++, mgfIndex ++){
			mgfResult [mgfIndex] = temp[j];
		}
	}
	
	return mgfResult;	
	
}

//******************************************************************
// RSA OAEP PKCS1
//******************************************************************

amRsa.oaep = {};
amRsa.oaep.encryptAndGenLabel = function (key_mod_str, key_exp_str, cleartext){
	var ENCODING_PARAMETER_SIZE_IN_BYTES = 16;
	var label = new Array(ENCODING_PARAMETER_SIZE_IN_BYTES);
	var rnd = new amUtil.SecureRandom();
	rnd.nextBytes (label);
	var baLabel = new BigInteger (label);
	sLabel = baLabel.toString(16).toUpperCase();
	sLabel = amUtil.zeroPad(sLabel, ENCODING_PARAMETER_SIZE_IN_BYTES * 2);
	var ciphertext = amRsa.oaep.encrypt(key_mod_str, key_exp_str, label, cleartext);
	
	return sLabel + ':' + ciphertext;
}
amRsa.oaep.encrypt = function (key_mod_str, key_exp_str, label, cleartext){
	var rsaPubKey = new amRsa.RSAKey();	
	rsaPubKey.setPublic (key_mod_str, key_exp_str);
	var SHA_DIGEST_LENGTH = 20;
	var paddedMessage = amRsa.oaepEncode(SHA_DIGEST_LENGTH, key_mod_str.length / 2, label, cleartext);
	
	var ciphertext = rsaPubKey.encrypt (new BigInteger (paddedMessage));
	ciphertext = amUtil.zeroPad(ciphertext, key_mod_str.length);
	return ciphertext.toUpperCase();
}

amRsa.pkcs1 = {};
amRsa.pkcs1.encrypt = function (key_mod_str, key_exp_str, cleartext){
	var rsaPubKey = new amRsa.RSAKey();	
	rsaPubKey.setPublic (key_mod_str, key_exp_str);
	
	var paddedMessage = amRsa.pkcs1pad2(cleartext, key_mod_str.length / 2);
	
	var encryptedMessage = rsaPubKey.encrypt (new BigInteger (paddedMessage));
	encryptedMessage = amUtil.zeroPad(encryptedMessage, key_mod_str.length);
	return encryptedMessage.toUpperCase();
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
amRsa.pkcs1pad2 = function (data, blockSize) {
  if(blockSize < data.length + 11) {
    throw "Message too long for RSA";
  }
  
  var padded = new Array(2);
  
  //First Byte
  padded[0] = 0 & 0xFF;
  
  // Second Byte
  padded[1] = 2 & 0xFF;
  
  //Pad String
  var padLength = blockSize - data.length - 2;
  var padString = new Array(padLength);
  var rng = new amUtil.SecureRandom();
  var x = new Array();
  for (var i = 0; i < padLength - 1; i ++){
	x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
	padString[i] = x[0];
  }
  
  padString[padLength - 1] = 0 & 0xFF;
    
  padded = padded.concat(padString, data);
  
  return padded;
}

//******************************************************************
// AES
//******************************************************************
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2011                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var amAes = {};  // Aes namespace

/**
 * AES Cipher function: encrypt 'input' state with Rijndael algorithm
 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
 *
 * @param {Number[]} input 16-byte (128-bit) input state array
 * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
 * @returns {Number[]}     Encrypted output state array
 */
amAes.cipher = function(input, w) {    // main Cipher function [§5.1]
  var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

  var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
  for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

  state = amAes.addRoundKey(state, w, 0, Nb);

  for (var round=1; round<Nr; round++) {
    state = amAes.subBytes(state, Nb);
    state = amAes.shiftRows(state, Nb);
    state = amAes.mixColumns(state, Nb);
    state = amAes.addRoundKey(state, w, round, Nb);
  }

  state = amAes.subBytes(state, Nb);
  state = amAes.shiftRows(state, Nb);
  state = amAes.addRoundKey(state, w, Nr, Nb);

  var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
  for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
  return output;
}

/**
 * Perform Key Expansion to generate a Key Schedule
 *
 * @param {Number[]} key Key as 16/24/32-byte array
 * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
 */
amAes.keyExpansion = function(key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
  var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nk = key.length/4  // key length (in words): 4/6/8 for 128/192/256-bit keys
  var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

  var w = new Array(Nb*(Nr+1));
  var temp = new Array(4);

  for (var i=0; i<Nk; i++) {
    var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
    w[i] = r;
  }

  for (var i=Nk; i<(Nb*(Nr+1)); i++) {
    w[i] = new Array(4);
    for (var t=0; t<4; t++) temp[t] = w[i-1][t];
    if (i % Nk == 0) {
      temp = amAes.subWord(amAes.rotWord(temp));
      for (var t=0; t<4; t++) temp[t] ^= amAes.rCon[i/Nk][t];
    } else if (Nk > 6 && i%Nk == 4) {
      temp = amAes.subWord(temp);
    }
    for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
  }

  return w;
}

/*
 * ---- remaining routines are private, not called externally ----
 */
 
amAes.subBytes = function(s, Nb) {    // apply SBox to state S [§5.1.1]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) s[r][c] = amAes.sBox[s[r][c]];
  }
  return s;
}

amAes.shiftRows = function(s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
  var t = new Array(4);
  for (var r=1; r<4; r++) {
    for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
    for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
  }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
  return s;  // see asmamAes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}

amAes.mixColumns = function(s, Nb) {   // combine bytes of each col of state S [§5.1.3]
  for (var c=0; c<4; c++) {
    var a = new Array(4);  // 'a' is a copy of the current column from 's'
    var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
    for (var i=0; i<4; i++) {
      a[i] = s[i][c];
      b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;

    }
    // a[n] ^ b[n] is a•{03} in GF(2^8)
    s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
    s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
    s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
    s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
  }
  return s;
}

amAes.addRoundKey = function(state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
  }
  return state;
}

amAes.subWord = function(w) {    // apply SBox to 4-byte word w
  for (var i=0; i<4; i++) w[i] = amAes.sBox[w[i]];
  return w;
}

amAes.rotWord = function(w) {    // rotate 4-byte word w left by one byte
  var tmp = w[0];
  for (var i=0; i<3; i++) w[i] = w[i+1];
  w[3] = tmp;
  return w;
}

// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
amAes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
amAes.rCon = [ [0x00, 0x00, 0x00, 0x00],
             [0x01, 0x00, 0x00, 0x00],
             [0x02, 0x00, 0x00, 0x00],
             [0x04, 0x00, 0x00, 0x00],
             [0x08, 0x00, 0x00, 0x00],
             [0x10, 0x00, 0x00, 0x00],
             [0x20, 0x00, 0x00, 0x00],
             [0x40, 0x00, 0x00, 0x00],
             [0x80, 0x00, 0x00, 0x00],
             [0x1b, 0x00, 0x00, 0x00],
             [0x36, 0x00, 0x00, 0x00] ]; 


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES CBC implementation in JavaScript (c) Andy 2011                                            */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

amAes.CbcPkcs7 = {};

amAes.CbcPkcs7.encrypt = function(plaintext, key, iv) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  var nBytes = key.length;
  var nBits = key.length*8;
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  
  // generate key schedule - an expansion of the key into distinct Key Rounds for each round
  var keySchedule = amAes.keyExpansion(key);
  
  var plaintextpad = amUtil.pkcs7Type1(plaintext, blockSize);
  var blockCount = Math.ceil(plaintextpad.length/blockSize);
  var ciphertext = new Array(blockCount*blockSize);  // ciphertext as array of strings
  var blockiv = iv.slice(0);
  for (var b=0; b<blockCount; b++) {
	var plainxoriv = new Array(blockSize);
	for (var i = 0; i < blockSize; i++) {
		plainxoriv[i] = blockiv[i] ^ plaintextpad[b*16+i];
	}
	var ciphertextPart = amAes.cipher(plainxoriv, keySchedule);  // -- encrypt counter block --
    blockiv = ciphertextPart;
	for (var i = 0; i < blockSize; i++) {
		ciphertext[b*16+i] = ciphertextPart[i];
	}
  }
  return ciphertext;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2011                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var amUtf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
amUtf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
amUtf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

//******************************************************************
// Big Integer by Tom Wu
//******************************************************************
/*
 * Copyright (c) 2003-2005  Tom Wu
 * All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * In addition, the following condition applies:
 *
 * All redistributions must retain an intact copy of this copyright notice
 * and disclaimer.
 */

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
	this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

//******************************************************************
// AM Utils
//******************************************************************

var amUtil = {};

amUtil.byte2dword = function (bin) {
  var result = new Array(); 
  for (var i = 0; i < bin.length; i++) { 
	result[i>>2] |= (bin[i] << (24-((i%4)*8)));
  }
  return result;
}

amUtil.dword2byte = function (binb) {
  var result = new Array(); 
  for (var i = 0; i < binb.length*4; i++) { 
	result[i] = (binb[i>>2] >> (24-(i%4)*8)) & 0xFF;
  }
  return result;
}
amUtil.hexDecode = function (inArr){
  var wrt = 0;
  var rd = 0;
//  var tmp = new Array(inArr.length/2);
  var tmp = new Array(1);
  var space = " ";
  var ch = 0;
  while (rd<inArr.length){
	// skip over spaces
	if ( inArr.charCodeAt(rd) == space.charCodeAt(0) )
	{
		++rd;
		continue;
	} 
	// assume no space between pairs
	ch = (amUtil.HexToNib(inArr.charCodeAt(rd)) << 4) + 
			   amUtil.HexToNib(inArr.charCodeAt(rd+1));
	if ( wrt >= tmp.length )
		tmp.push(ch);
	else
		tmp[wrt] = ch;
	++wrt;
	rd += 2;
  }
  return tmp;
}

// return the integer value of the hex character 'h'
amUtil.HexToNib = function (h) {
	if ( h >= 65 && h <= 70 )
		return h-55;
	if ( h >= 97 && h <= 102 )
		return h-87;
	else
		return h-48;
}

// return the integer value of the hex character 'h'
amUtil.int2bin = function (num, numOfBytes) {
	var binValue = [];
	for (var i = numOfBytes-1; i >= 0; i--) {
	   binValue[numOfBytes-1-i] = (num >>> (i * 8)) & 0xFF;
	}
	return binValue;
}

amUtil.str2bin = function (stringValue){
	var binValue = [];
	var utf8Value = unescape(encodeURIComponent(stringValue));
	
	for (var i = 0; i < utf8Value.length; i++){
		binValue[i] = utf8Value.charCodeAt(i) & 0xFF;
	}
	return binValue;
}

amUtil.bin2str = function (inArr){
	var str = '';
	
	for (var i = 0; i < inArr.length; i ++){
		str = str + String.fromCharCode(inArr[i]);
	}
	return decodeURIComponent(escape(str));
}

amUtil.hexEncode = function (inArr){
    var ctr = 0;
    var tmp = "";
    var sArr = [];
 
    ctr = 0;
    while (ctr<inArr.length){
        sArr[ctr] = amUtil.addHex(inArr[ctr]);
        ++ctr;
    }
    tmp = sArr.join("");
    return tmp;
}

amUtil.addHex = function (val)
{
    var x = (val >>> 4) & 15;
	if ( x > 9 ) x += 55; else x+= 48;
    var s = String.fromCharCode(x);
    x = val & 15;
    if ( x > 9 ) x += 55; else x+= 48;
    s = s + String.fromCharCode(x);
    return s;
}

amUtil.pkcs7Type1 = function (data, blockSize){
	var padCount = 0;
	
	if (data.length < blockSize)
		padCount = blockSize - data.length;
	else
		padCount = blockSize - (data.length % blockSize);
			
	var padArr = [];
	
	for (var i = 1; i <= padCount; i ++){
		padArr[i-1] = padCount & 0xFF;
	}
		
	return data.concat (padArr);
}

amUtil.pkcs7GetPaddingCount = function (data, blockSize){

	var count = data[data.length - 1];
	
	if (count > data.length || count == 0)
	{
		 throw "pad block corrupted";
	}
	
	for (var i = 1; i <= count; i++)
	{
		if (data[data.length - i] != count)
		{
			throw "pad block corrupted";
		}
	}

	return count;
}


amUtil.zeroPad = function (strInput, outputLength){
	var output = strInput;
		
	for ( ; output.length < outputLength; ){
		output = '0' + output;
	}
		
	return output;	
}

// convert a (hex) string to a bignum object
amUtil.parseBigInt = function (str,r) {
  return new BigInteger(str,r);
}

amUtil.xor = function (first, second){
	var result = [];
	if (first.length != second.length)
		throw 'XOR failure: two binaries have different lengths';
	for (var i = 0; i < first.length; i ++)
		result[i] = first[i] ^ second[i];
	return result;
}


amUtil.generateRandom = function (randomLength){
	var a = [];
	for (i=0; i<randomLength; i++)
		a[i]=(Math.floor(256*Math.random()));
	return a;
}

//******************************************************************
// RNG by Tom Wu
//******************************************************************
// prng4.js - uses Arcfour as a PRNG

amUtil.Arcfour = function () {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
amUtil.ARC4init = function (key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

amUtil.ARC4next = function () {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

amUtil.Arcfour.prototype.init = amUtil.ARC4init;
amUtil.Arcfour.prototype.next = amUtil.ARC4next;

// Plug in your RNG constructor here
amUtil.prng_newstate = function () {
  return new amUtil.Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
amUtil.rng_psize = 256;

// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='amUtil.rng_seed_time();' onKeyPress='amUtil.rng_seed_time();'>
// in your main HTML document.

amUtil.rng_state;
amUtil.rng_pool;
amUtil.rng_pptr;

// Mix in a 32-bit integer into the pool
amUtil.rng_seed_int = function (x) {
  amUtil.rng_pool[amUtil.rng_pptr++] ^= x & 255;
  amUtil.rng_pool[amUtil.rng_pptr++] ^= (x >> 8) & 255;
  amUtil.rng_pool[amUtil.rng_pptr++] ^= (x >> 16) & 255;
  amUtil.rng_pool[amUtil.rng_pptr++] ^= (x >> 24) & 255;
  if(amUtil.rng_pptr >= amUtil.rng_psize) amUtil.rng_pptr -= amUtil.rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
amUtil.rng_seed_time = function () {
  amUtil.rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(amUtil.rng_pool == null) {
  amUtil.rng_pool = new Array();
  amUtil.rng_pptr = 0;
  var t;
  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for(t = 0; t < z.length; ++t)
      amUtil.rng_pool[amUtil.rng_pptr++] = z.charCodeAt(t) & 255;
  }  
  while(amUtil.rng_pptr < amUtil.rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    amUtil.rng_pool[amUtil.rng_pptr++] = t >>> 8;
    amUtil.rng_pool[amUtil.rng_pptr++] = t & 255;
  }
  amUtil.rng_pptr = 0;
  amUtil.rng_seed_time();
  //amUtil.rng_seed_int(window.screenX);
  //amUtil.rng_seed_int(window.screenY);
}

amUtil.rng_get_byte = function () {
  if(amUtil.rng_state == null) {
    amUtil.rng_seed_time();
    amUtil.rng_state = amUtil.prng_newstate();
    amUtil.rng_state.init(amUtil.rng_pool);
    for(amUtil.rng_pptr = 0; amUtil.rng_pptr < amUtil.rng_pool.length; ++amUtil.rng_pptr)
      amUtil.rng_pool[amUtil.rng_pptr] = 0;
    amUtil.rng_pptr = 0;
    //amUtil.rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return amUtil.rng_state.next();
}

amUtil.rng_get_bytes = function (ba) {
  var i;
  for(i = 0; i < ba.length; ++i){
	var temp = amUtil.rng_get_byte();
	while ( i == 0 && (temp&0x80) != 0){
		temp = amUtil.rng_get_byte();
	}
	ba[i] = temp;
  }
}

amUtil.SecureRandom = function () {}

amUtil.SecureRandom.prototype.nextBytes = amUtil.rng_get_bytes;


