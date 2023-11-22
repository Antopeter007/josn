var input, filter, ul, li, a, i;
var validReferenceNumber, actionCode, refId, tnxID, tnxStatCode, productFound, tnxTypeCode, screenUrl, subProdCode;

function completeVal(index) {
	document.getElementById("searchInput").value = document.getElementById(index).innerHTML;
	document.getElementById("transIDinnerdiv").innerHTML = '';
}

function searchInpOnKeyup() {
	input = document.getElementById("searchInput");
	filter = input.value.toUpperCase();
	filter = filter.replace(">","&GT;"); // > is rendered as &GT; toUpperCase
	ul = document.getElementById("menuUL");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1 && input.value.length > 0) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
	// Ajax call to load on typing
	if (event.keyCode != undefined && event.keyCode != 0 && event.keyCode != 13 && event.keyCode != 32 && event.which != undefined && event.which != 0 && event.which != 13 && event.which != 32) {
		var inputval = document.getElementById("searchInput").value;
		if (inputval.length > 3 && inputval.indexOf(" ") == -1) {
			misys.xhrPost({
				url : misys.getServletURL("/screen/AjaxScreen/action/RetrieveReferenceData"),
				handleAs : "json",
				sync : true,
				content : {
					INPUT : filter,
					REQACT : 'D'
				},

				load : function(response, args) {
					var array = response.responseData.REF_LIST;
					var transIDinnerdiv = document.getElementById("transIDinnerdiv");
					if (transIDinnerdiv) {
						document.getElementById("transIDinnerdiv").innerHTML = '';
					} else {
						transIDinnerdiv = document.createElement("div");
						transIDinnerdiv.setAttribute("id", "transIDinnerdiv");
					}
							
					for (i = 0; i < array.length; i++) {
						var divtag = document.createElement("div");
						var link = document.createElement("a");
						link.innerHTML = array[i];
						divtag.setAttribute("id", "div" + i);
						link.setAttribute("id", "link" + i);
						link.setAttribute("onClick", "completeVal('link" + i + "')");
						divtag.appendChild(link);
						transIDinnerdiv.appendChild(divtag);
					}
					document.getElementById("transIDdiv").appendChild(
							transIDinnerdiv);
					document.getElementById("transIDdiv").style.display = 'block';
				}
			});

		} else {
			
			document.getElementById("transIDdiv").style.display = 'none';
		}
	}

	document.getElementById("searchInput").onkeydown = function(event) {
		if (event.keyCode == 8 || event.which == 8) {
			var input12 = document.getElementById("searchInput").value;
			if (input12.indexOf(" ") == (input12.length - 1)) {
				document.getElementById("actionUL").style.display = "none";
				document.getElementById("actionULTrade").style.display = "none";
			}
		}
	};
	// Ajax on Submit
	document.getElementById("searchInput").onkeypress = function(event) {
		var inputValue = document.getElementById("searchInput").value;
		if (event.keyCode == 13 || event.which == 13) {
			document.getElementById("transIDdiv").style.display = 'none';
			misys.xhrPost({
						url : misys.getServletURL("/screen/AjaxScreen/action/RetrieveReferenceData"),
						handleAs : "json",
						sync : true,
						content : {
							INPUT : filter,
							REQACT : 'A'
						},

						load : function(response, args) {
							productFound = response.responseData.productCode;
							validReferenceNumber = response.responseData.valid;
							actionCode = response.responseData.actionCode;
							tnxID = response.responseData.tnxID;
							tnxStatCode = response.responseData.tnxStatCode;
							tnxTypeCode = response.responseData.tnxTypeCode;
							subProdCode = response.responseData.subProdCode;
							refId = response.responseData.refID;
							screenUrl = response.responseData.screenUrl;
							var URL = retrieveURL();
							if (validReferenceNumber) {
								if (URL != null) {
									window.location = URL;
								} else {
									misys.dialog.show("ERROR", misys.getLocalization("invalidTransactionActionSearchErrorMsg"),[]);
								}
							} else {
								misys.dialog.show("ERROR", misys.getLocalization("invalidTransactionNumberSearchErrorMsg"),[]);
							}
						}
					});
		}

		else if ((/^[a-zA-Z]{2}[0-9]{14}$/i).test(inputValue) && (event.keyCode == 32 || event.which == 32)) {
			document.getElementById("transIDdiv").style.display = "none";

			if (inputValue.length > 2) {
				var prodCode = inputValue.substring(0, 2);
				if (prodCode === 'LC' || prodCode === 'EC' || prodCode === 'BG' || prodCode === 'SI' || prodCode === 'LS') {
					document.getElementById("actionULTrade").style.display = "block";
				} else if (prodCode === 'EL' || prodCode === 'IC' || prodCode === 'BR' || prodCode === 'SG' || prodCode === 'SR' || prodCode === 'IR' || prodCode === 'LI') {
					document.getElementById("actionUL").style.display = "block";
				} else {
					document.getElementById("actionULTrade").style.display = "none";
					document.getElementById("actionUL").style.display = "none";
				}
			}
		} 
	};
}

function searchInpOnFocus() {
	searchInpOnKeyup();
	document.getElementById("menuUL").style.display = "block";
}

function searchInpOnBlur() {
	searchInpOnKeyup();
	document.getElementById("menuUL").style.display = "hidden";
}

//action and transaction search
function retrieveURL() {
	if (actionCode != null) {
		actionCode = actionCode.toLowerCase();
	}
	if ((actionCode == null) && (tnxTypeCode === '01' && tnxStatCode === '01')) {
		// returns edit screen
		return misys.getServletURL(screenUrl + "?mode=DRAFT&tnxtype=01&referenceid=" + refId + "&tnxid=" + tnxID);
	} else if ((actionCode == null) && (productFound === 'FT') && (tnxTypeCode === '54' && tnxStatCode === '03')) {
		return misys.getServletURL("/screen/ReportingPopup?option=FULL&referenceid=" + refId + "&tnxid=" + tnxID + "&productcode=" + productFound);
	} else if (actionCode == null) {
		// returns inquiry screen
		return misys.getServletURL(screenUrl + "?productcode=" + productFound + "&operation=LIST_INQUIRY&referenceid=" + refId + "&option=HISTORY");
	} else if ((actionCode === '1' && tnxTypeCode === '01' && tnxStatCode === '04') && (productFound === 'LC' || productFound === 'EC' || productFound === 'BG' || productFound === 'SI' || productFound === 'LS')) {
		// returns amend screen for trade products
		return misys.getServletURL(screenUrl + "?tnxtype=03&referenceid=" + refId + "&option=EXISTING");
	} else if ((actionCode === '2' && tnxTypeCode === '01' && tnxStatCode === '04') && (productFound === 'LC' || productFound === 'EL' || productFound === 'IC' || productFound === 'EC' || productFound === 'BG' || productFound === 'BR' || productFound === 'SG' || productFound === 'SI' || productFound === 'SR' || productFound === 'IR' || productFound === 'LI' || productFound === 'LS' || (productFound === 'TD' && subProdCode === 'TRTD'))) {
		// returns message to bank screen for trade products
		return misys.getServletURL(screenUrl + "?tnxtype=13&referenceid=" + refId + "&option=EXISTING");
	} else {
		return null;
	}

}

