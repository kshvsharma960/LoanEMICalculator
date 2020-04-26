/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        eventBinder();
        document.getElementById("pageN").on("click",FDSelected());
        //$("#homePage a").on("click",function(this){}
    }
};

var type="";
var labelValue="";
var currencySymbol = "Rs ";//"₹";
var homeRate=8.99;
var homeTime=360;

var personalRate=12;
var personalTime=60;

var carRate=10;
var carTime=84;

function emiCalculator(P,R,N,isEMI=1){
    let EMI=0;
    let NQ=N/4;
    let i=R/4;
    switch(isEMI){
        case 0: //FD
            EMI = (P * (Math.pow((1 + (R/25),(4*NQ)))));
            break;
        case 1: //EMI
            EMI = (P * R * (Math.pow((1+R),N)))/((Math.pow((1+R),N))-1);
            break;
        case 2: //RD
            let i=R/4;
            EMI= (P * (Math.pow((1+i),NQ)-1) )/ (1-(Math.pow((1+i),(-1/3))));
            break;
        default:EMI = (P * R * (Math.pow((1+R),N)))/((Math.pow((1+R),N))-1);
    }

    return EMI;
}
function getType(e){
    var target = e;
    type=target.currentTarget.text.split(" ")[0].toLowerCase();
    ValueInitializer();
}
function readInputs(){
    var readObj={};
    
    var inputPrincipal=$("#"+type+"Amount")[0].value;
    //
    var principal=undoFormatnumber(inputPrincipal);
    $("#"+type+"Amount")[0].value=principal;
    formatCurrency($("#"+type+"Amount"));
    var interest=$("#"+type+"Rate")[0].value;
    interest=interest/(1200);
    var months=$("#"+type+"Time")[0].value;
    readObj.P=principal;
    readObj.R=interest;
    readObj.N=months;
    return readObj;
}

function initiateCalculations(x){
    var inputObj=readInputs();    
    var emi=emiCalculator(inputObj.P,inputObj.R,inputObj.N);
    var totalEMIAmt=0;
    var totalInterest=0;
    totalEMIAmt=emi*inputObj.N;
    var monthlyInterestPayout=0;
    

    totalInterest=totalEMIAmt-(inputObj.P);
    monthlyInterestPayout=totalInterest/ inputObj.N;
    bindOutput( type=="X"?monthlyInterestPayout.toFixed(2):emi.toFixed(2),totalEMIAmt.toFixed(2), totalInterest.toFixed(2));
    //formatCurrency($("#"+type+"Amount"));
    formatCurrency($("#" + type + "EMI"));
    formatCurrency($("#" + type + "InterestPayable"));
    formatCurrency($("#" + type + "TotalPayment"));
}

function bindOutput(emi, totalAmt, totalInterest) {
    
    $("#" + type + "EMI")[0].value=emi;
    $("#" + type + "InterestPayable")[0].value=totalInterest;
    $("#" + type + "TotalPayment")[0].value= totalAmt;
}

function FDSelected(){
    modifyDOMProperties();
    //labelEdit("XRateLabel",6);
}

function bindInput(P,R,T){
    $("#" + type + "Amount")[0].value=P;
    $("#" + type + "Rate")[0].value=R.toFixed(2);
    $("#" + type + "Time")[0].value= T;
    formatCurrency($("#"+type+"Amount"));
}
function ValueInitializer(){
    var inputObj={};
    labelValue=type.toUpperCase();
    switch(type.toLowerCase()){
        case "home":
                bindInput(0,homeRate,homeTime);
            break;
        case "car":
                bindInput(0,carRate,carTime);
            break;
        case "personal":
                bindInput(0,personalRate,personalTime);
            break;
        case "fd","fixed":
            type="X";            
            bindInput(0,6,personalTime);
        break;
        case "rd":
                type="X";
                bindInput(0,6,personalTime);
            break;
        default:
                bindInput(0,0,0);

    }
    

}

function eventBinder(){
    $("#homePage a").click(function(x) {
        getType(x);
    });
    var inputBox=document.getElementsByTagName("input");
    $(inputBox).on("input",function(x){initiateCalculations(x);});

    $(".interestInput").on("blur",function(){
        $(this).val(parseFloat($(this).val()).toFixed(2));
    });
    /*document.getElementsByClassName(".interestInput").onblur=function(){
        $(".interestInput")
    }*/
}

function undoFormatnumber(n){
    return Number(n.replace(/[^0-9.-]+/g,""));
}

function formatNumberInternation(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  
  function formatNumberIndian(num) {
    var n1, n2;
    num = num + '' || '';
    // works for integer and floating as well
    n1 = num.split('.');
    n2 = n1[1] || null;
    n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    num = n2 ? n1 + "" + n2 : n1;
    return num;
}

function createHTML(labelID,labelName,inputID,isDisabled="",targetID="contentBody"){
    
    var htmlContent=document.getElementById(targetID);
    var htmlComponent='<label id="'+labelID+'">'+labelName+'</label><input id="'+inputID+'" type="text" '+isDisabled+'/>';
    $(htmlContent).append(htmlComponent);
}

function modifyDOMProperties(){
    labelEdit("XAmountLabel"," Amount")
    labelEdit("XRateLabel"," Interest Rate(%)");
    labelEdit("XTimeLabel"," Tenure(Months)");    
    labelEdit("XEMILabel","Monthly Payout");
    labelEdit("XInterestPayableLabel","Interest Earned");
    labelEdit("XTotalPaymentLabel"," Maturity Amount");

    $("#pageNheading1").html("FIXED DEPOSIT");
    $("#pageNheading2").html("FD Calculator");
    $("#XFooter").html("FIXED DEPOSIT");
    
    return true;
    // <div id="contentBody">
	// 			<label id="XAmountLabel">Amount</label>
	// 			<input id="XAmount" type="text"/>
				
	// 			<label id="XRateLabel">Interest Rate (%)</label>
	// 			<input id="XRate" class="interestInput" type="number" />

	// 			<label id="XTimeLabel">Tenure</label>
	// 			<input id="XTime" type="number" />
	
	// 			<label id="XEMILabel">Loan EMI</label>
	// 			<input id="XEMI" type="text" disabled/>

	// 			<label id="XInterestPayableLabel">Interest Payable</label>
	// 			<input id="XInterestPayable" type="text" disabled/>

	// 			<label id="XTotalPaymentLabel">Total Payment</label>
    // 			<input id="XTotalPayment" type="text" disabled/>
    
}

function labelEdit(id,Value){
    $("#"+id)[0].textContent=Value
}

function createPage(){
    createHTML("FDAmountLabel","Fixed Desposit Amount","FDAmount","",);
}

function formatNumber(n){
    return formatNumberIndian(n);
    //return formatNumberInternation(n);
}
  
  function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.
    
    // get input value
    var input_val = input.val();
    
    // don't validate empty input
    if (input_val === "") { return; }
    
    // original length
    var original_len = input_val.length;
  
    // initial caret position 
    var caret_pos = input.prop("selectionStart");
      
    // check for decimal
    if (input_val.indexOf(".") >= 0) {
  
      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      var decimal_pos = input_val.indexOf(".");
  
      // split number by decimal point
      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);
  
      // add commas to left side of number
      left_side = formatNumber(left_side);
  
      // validate right side
      right_side = formatNumber(right_side);
      
      // On blur make sure 2 numbers after decimal
      if (blur === "blur") {
        right_side += "00";
      }
      
      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);
  
      // join number by .

      input_val = currencySymbol + left_side + "." + right_side;
  
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = formatNumber(input_val);
      input_val = currencySymbol + input_val;
      
      // final formatting
      if (blur === "blur") {
        input_val += ".00";
      }
    }
    
    // send updated string to input
    input.val(input_val);
  
    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
  }
app.initialize();
