dojo.provide("misys.binding.cash.create_loan");

(function(/* Dojo */d, /* Dijit */dj, /* Misys */m) {
	
	function _populateResponse(response, ioArgs)
	{
		console.debug("_populateResponse");
		if(dijit.byId("entity"))
		{
			dojo.byId("entityIdTrancheDiv").innerHTML = dijit.byId("entity").get("value");
		}		
						
		m.animate("wipeOut", "loan_summary_div", function(){
			var loanTrancheGrid = dijit.byId("loanTrancheGrid");
			var store = new dojo.data.ItemFileReadStore({data: response});
			loanTrancheGrid.setStore(store);
			console.debug("store :", store);
			_hideFirstRow();
			d.byId("accountNumberTrancheDiv").innerHTML = response.items[0].ACCOUNT_NUMBER;
			d.byId("lineOfCreditTrancheDiv").innerHTML =  response.items[0].LINE_OF_CREDIT;
			d.byId("branchTrancheDiv").innerHTML =  response.items[0].BRANCH_NUMBER;	
			d.byId("accountNameTrancheDiv").innerHTML =  response.items[0].ACCOUNT_NAME;			
			dojo.byId("disbursementTotalContainerDiv").innerHTML = response.items[0].DISBURSEMENT_AMT;
			d.style("loan_tranche_summary_div","display","block");
			d.style("loan_tranche_summary_div","overflow","visible");
			loanTrancheGrid.resize();

		});
	}
	
	function _hideFirstRow ()
	{
		var g = dijit.byId('loanTrancheGrid');
		var hiddenRows = [0];
				
		var _hideRow = function(index){
			dojo.forEach(g.views.views, function(v){
				dojo.style(v.rowNodes[index], {'display':"none"});
			});				
		};
		//hide rows		
		dojo.forEach(hiddenRows, _hideRow);

		//make sure they are also hidden when rendered later 
		dojo.connect(g.views, 'renderRow', function(index){
			if(dojo.indexOf(hiddenRows, index) >= 0){
				_hideRow(index);
			}
		});
	}
	
	function _populateTrencheResponse(response, ioArgs)
	{		
		console.debug("_populateTrencheResponse");
		m.animate("wipeOut", "loan_summary_div");		
		m.animate("wipeOut", "loan_tranche_summary_div", function(){			
			misys.animate("wipeIn", "loan_details_div");
			var trancheAcctNum = response.items[0].AcctId;
			var trancheNum,acctNum; 
			trancheNum = trancheAcctNum.substring(trancheAcctNum.length-5);
			acctNum = trancheAcctNum.substring(0,trancheAcctNum.length-5);
			d.byId("trancheNumDiv").innerHTML = trancheNum;
			d.byId("acctIdDiv").innerHTML = acctNum;
			d.byId("prodTypeDiv").innerHTML = response.items[0].ProdType;
			d.byId("disbursedAmtDiv").innerHTML = response.items[0].DisbursedAmt;
			d.byId("termDiv").innerHTML = response.items[0].Term;
			d.byId("intRateDiv").innerHTML = response.items[0].IntRate;
			d.byId("immediatePastDuePrincipalAmtDiv").innerHTML = response.items[0].ImmediatePastDuePrincipalAmt;
			d.byId("repmtDueImmediateDiv").innerHTML = response.items[0].RepmtDueImmediate;
			d.byId("advancePmtDiv").innerHTML = response.items[0].AdvancePmt;
			d.byId("lastRepmtAmtDiv").innerHTML = response.items[0].LastRepmtAmt;
			d.byId("immediatePastDueChargesAmtDiv").innerHTML = response.items[0].ImmediatePastDueChargesAmt;
			d.byId("immediatePastDueIntAmtDiv").innerHTML = response.items[0].ImmediatePastDueIntAmt;
			d.byId("nextRepmtPastDuePrincipalAmtDiv").innerHTML = response.items[0].NextRepmtPastDuePrincipalAmt;
			d.byId("nextRepmtPastDueIntAmtDiv").innerHTML = response.items[0].NextRepmtPastDueIntAmt;
			d.byId("nextRepmtPastDueChargesAmtDiv").innerHTML = response.items[0].NextRepmtPastDueChargesAmt;
			d.byId("loanAmtDueDate").innerHTML = response.items[0].NextRepmtDueDt;
			d.byId("immediateLoanAmtTotalDiv").innerHTML = response.items[0].TotalAmtImd;
			d.byId("loanAmtDueDateTotal").innerHTML = response.items[0].TotalAmtDueDate;
		});
		
	}
	function _populateSummaryResponse(response, ioArgs)
	{
		console.debug("_populateSummaryResponse");
		m.animate("wipeOut", "loan_tranche_summary_div");
		//m.animate("wipeIn", "loan_summary_div");
		var loanGrid = dijit.byId("loanGrid");
		var storeLoanGrid = new dojo.data.ItemFileReadStore({data: response});
		loanGrid.setStore(storeLoanGrid);
		//d.byId("divEqvLineOfCreditSpan").innerHTML = response.TOTAL_EQV_LINE_OF_CREDIT;
		d.byId("divEqvOutPrincAmtSpan").innerHTML =  response.TOTAL_EQV_OUTSTANDING_PRINC_AMT;
		//d.byId("divEqvAvalDrawdownSpan").innerHTML =  response.TOTAL_EQV_AVAILABLE_DRAWDOWN;	
		m.animate("wipeIn", "loan_summary_div");
		d.style("loan_summary_grid_div","display","block");
		d.style("loan_summary_grid_div","overflow","visible");
		m.animate("wipeIn", "totalDiv");
		loanGrid.resize();
	}
	function _setExportFileName()
	{
		console.debug("_setExportFileName");
		var extension = dj.byId("export_list");
		if(extension != "screen")
			{
				var name = "LoanSummary." + extension;
				dj.byId("filename").set("value", name);
			}	
	}
	
	function _setupSearchFields() {
		// summary:
		//       If there is a search form in the page (e.g. for pages that list 
		//       transactions in a grid), then 

		console.debug("_setupSearchFields");
		if(d.byId(TransactionSearchForm)) {
			m.connect(TransactionSearchForm, "onSubmit",  function(/*Event*/ e){
				var strCurrentFormat = dj.byId(_exportListFieldId) ? 
						                 dj.byId(_exportListFieldId).get("value") : "screen";
				if (e && strCurrentFormat === "screen") {
					e.preventDefault();
				}
				if(this.isValid()) {
					if (strCurrentFormat !== "screen") {
						dj.byId(_filenameFieldId).set("value", "inquiry."+strCurrentFormat);
						return true;
					} else {
						m.grid.reloadForSearchTerms();
						return false;
					}
				}
			});
		}
	}
	
	d.mixin(m, {
		
			loanSummary : function (/*String*/acctNo,
									/*String*/legalIdNo,
									/*String*/legalIdType,
									/*String*/legalOwnerCountry,
									/*String*/bankId,
									/*String*/branchNo) {			    
				console.debug('[FormEvents] Checking for loan summary');
				m.animate("wipeOut", "loan_summary_div");
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/GetLoanSummary"),
					handleAs : "json",
					sync : true,
					content : {
						acctNo : acctNo,
						legalIdNo : legalIdNo,
						legalIdType : legalIdType,
						legalOwnerCountry : legalOwnerCountry,
						bankId : bankId,
						branchNo : branchNo
					},				
					load : function(response, ioArgs)
					{ 
						_populateResponse(response, ioArgs);
					},
				     customError : function(response, ioArgs) {
				    	 console.error(response);
				      }		    
				});
				return null;
			},
		
			loanTrancheDetails : function (/*String*/acctNo,
											/*String*/legalIdNo,
											/*String*/legalIdType,
											/*String*/legalOwnerCountry,
											/*String*/bankId,
											/*String*/branchNo,
											/*String*/trancheNo) {			    
				console.debug('[FormEvents] Checking for loan trenche details');
				d.byId("trancheNumDiv").innerHTML = trancheNo;
				m.xhrPost({
					url : m.getServletURL("/screen/AjaxScreen/action/GetLoanTrencheDetail"),
					handleAs : "json",
					sync : true,
					content : {
						acctNo : acctNo,
						legalIdNo : legalIdNo,
						legalIdType : legalIdType,
						legalOwnerCountry : legalOwnerCountry,
						bankId : bankId,
						branchNo : branchNo,
						trancheNo : trancheNo
					},
					load : function(response, ioArgs){ 
						_populateTrencheResponse(response, ioArgs);
					},
					customError : function(response, ioArgs) {
						console.error(response);
					}		    
				});
				return null;
			},
			backToSummary : function () {	
				console.debug("backToSummary");
				m.animate("wipeOut", "loan_tranche_summary_div");
				m.animate("wipeOut", "loan_details_div");
				m.animate("wipeIn", "loan_summary_div");			
			},			
						
			bind : function(){
				console.debug("bind");
				m.setValidation("acctCcy", m.validateCurrency);
				m.connect("entity", "onChange", function(){				
					dj.byId("account_no").set("value", "");
					dj.byId("acctCcy").set("value", dj.byId("user_cur_code").get("value"));
				});
				m.connect("loanGrid","_onFetchComplete",function(){
					console.debug("Loan Grid reloaded"); 
					var ccyValue = dijit.byId("acctCcy").get("value");
					var headerName = dojo.byId("loanGridHdr6").children[0].innerHTML;
					
					if(!misys._config.loanGridEquTotalheaderName)
					{
						misys._config.loanGridEquTotalheaderName = headerName;
					}
					
					dijit.byId("loanGrid").layout.cells[6].name = misys._config.loanGridEquTotalheaderName + " (" + ccyValue + ")";
					//dojo.byId("loanGridHdr6").children[0].innerHTML = headerName + " (" + ccyValue + ")";
				});
			},
			onFormLoad : function() {
				console.debug("onFormLoad");
				m.toggleRequired("entity", true);
				//d.style("loan_summary_grid_div","display","none");
				m.connect("export_list", "onChange", _setExportFileName);		
			}			
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.create_loan_client');