
//fxn to create XMLHttpRequest objects
function createXHR() {
    try {
        return new XMLHttpRequest();
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
}

// fxn called by primary html page WT.html
function ajaxWalnutFunction(){
    var xhr;					// The variable that makes Ajax possible!

    
// first get user radio button choice
    walnutOptionChoices	= document.getElementsByName("walnuts");
    for (i=0; i < walnutOptionChoices.length; i++) {
        if (walnutOptionChoices[i].checked) {
            user_input = walnutOptionChoices[i].value;
            break;
         }
    }

    if (user_input) {
        if (user_input == "deleteDB") {
             if (confirm("Are you sure you REALLY want to delete walnuts database?"))
                { ; } else {				
                return false;// delete database aborted
                } 
            }
        if (user_input == "add") {
        openResult = window.open("http://localhost/walnuts/addNut.html", "_self");
        return false;
        }
        if (user_input == "list") {
        openResult = window.open("http://localhost/walnuts/listNuts1.html", "_self" ); /* , "scrollbars=1" */
        return false;
        }
            
    } else {
      document.getElementById("response").innerHTML = "No choice selected - pick a button or quit!";
      return false;  // nada checked
    }
    
    // get ajax request obj		
    xhr = createXHR();
    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function(){	
        if(xhr.readyState == 4 && xhr.status == 200) {
           document.getElementById("response").innerHTML=xhr.responseText;		   
        }
    }	
    xhr.open("GET", "walnutAction.php?value=" + user_input,  true);
    xhr.send(null); 	
}



function getPostDataJSON() { 
    
    var data_json = '{"walnutID": "' + document.forms[0].walnutID.value + '","SirName":"' + document.forms[0].SirName.value + '","Names":"' + document.forms[0].Names.value + '","FormalNames":"' + document.forms[0].FormalNames.value + '","Children":"' + document.forms[0].Children.value + '","Addr1":"' + document.forms[0].Addr1.value + '","Addr2"  : "' + document.forms[0].Addr2.value + '","Addr3"  : "' + document.forms[0].Addr3.value + '","Addr4"  : "' + document.forms[0].Addr4.value + '","Email1" : "' + document.forms[0].Email1.value + '","Email2" : "' + document.forms[0].Email2.value + '","Email3" : "' + document.forms[0].Email3.value + '","Phone1" : "' + document.forms[0].Phone1.value + '","Phone2" : "' + document.forms[0].Phone2.value + '","Notes"  : "' + document.forms[0].Notes.value + '"}';
    
    var send_data = 'value=' + data_json;
    return send_data;
}

function ajaxAddNuts() {

    if (document.getElementById('SirName').value.length == 0 ) {
        document.getElementById('addNutResponse').innerHTML = 'Need more Info! Try again...';
        return false;
    }
    
    // get local ajax request obj
    var xhr = createXHR(); 

    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function(){	
        if(xhr.readyState == 4 && xhr.status == 200) {
           document.getElementById("addNutResponse").innerHTML=xhr.responseText;		
        }
    }
    var addData = getPostDataJSON();  
    xhr.open("POST", "addNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");	
    xhr.send(addData); 
// clear the form once sent
//	document.getElementById('addNutForm').reset();

}
function confirmDel(nutId) {
	var r=confirm("Are you sure?");
	if (r==true){
		var xhr = createXHR(); 	
		if (!xhr) {
			return false;
		}
    // Create a function that will receive data sent from the server
		xhr.onreadystatechange = function(){	
			if(xhr.readyState == 4 && xhr.status == 200) {
				document.getElementById("delNutResponse").innerHTML=xhr.responseText;
			 }
		}
		xhr.open("GET", "delNut.php?value=" + nutId, true);
		xhr.send(null); 
	} else {
	  return;
	}
}

var walnutEntries = [];
var numNuts; // num entries in walnuts database

 /* called by ajaxListNuts() fxn below - user is who is making request, admin or gen user, target is where to start the display in database */
function displayPage(user, startPoint) {
    'use strict';
    // get # entries in database into global var numNuts
    numNuts = walnutEntries.length;
    var replacementStr = "";
	var replacementStrLt = "";
	var replacementStrRt = "";
    for (var i = startPoint; i < numNuts; i += 1) {
        replacementStr =  "<p><pre><a class='oneNut'" + "href='editNut.html?value=" + walnutEntries[i].walnutID + "' title='Update'>" + walnutEntries[i].SirName + "</a>";
        if (user == 'admin') {
  /*          replacementStr += "<a class='oneNut' href='/delNut.php?value=" + walnutEntries[i].walnutID + "'>" + "                    <img src='/images/Walnuts/deleteIcon.gif' title='Delete'/></a>" + "<br>"; */
             replacementStr += "<a class='oneNut' href='' onclick='confirmDel(" + walnutEntries[i].walnutID + ");'>" + "                    <img src='/images/Walnuts/deleteIcon.gif' title='Delete'/>" + "</a><span id='delNutResponse'></span><br>";
        }		
        replacementStr += walnutEntries[i].Names + "<br>";
        replacementStr += ((walnutEntries[i].FormalNames) ? (walnutEntries[i].FormalNames + "<br>") : "");
        replacementStr += ((walnutEntries[i].Children) ? (walnutEntries[i].Children + "<br>") : "");
        replacementStr += "Address: " + walnutEntries[i].Addr1 + "<br>";
        replacementStr += ((walnutEntries[i].Addr2) ? "         " + (walnutEntries[i].Addr2 + "<br>") : "");
        replacementStr += "         " + walnutEntries[i].Addr3 + "<br>";
        replacementStr += "         " + walnutEntries[i].Addr4 + "<br>";
        replacementStr += "Email 1: " + walnutEntries[i].Email1 + "<br>";
        replacementStr += "      2: " + walnutEntries[i].Email2 + "<br>";
        replacementStr += "Phone 1: " + walnutEntries[i].Phone1 + "<br>";
        replacementStr += "      2: " + walnutEntries[i].Phone2 + "<br>";
        replacementStr += "Notes:   " + walnutEntries[i].Notes + "<br>" + "</pre>" + "<br><br>";
        if (!(i % 2)) {
            replacementStrLt += replacementStr;
        } else {
            replacementStrRt += replacementStr;
        }
        replacementStr = "";
    }
    $(".replaceLt").html(replacementStrLt);
    $(".replaceRt").html(replacementStrRt);
    return;
}

// fxn called by list nuts html page - which user determines api, and recPtr is where to begin display 
/*jslint browser: true*/
/*global $, jQuery, createXHR, walnutEntries:true, displayPage*/
function ajaxListNuts(user, recPtr) {
//call php fxn to open Walnuts db and retieve/return all records for display

    // get local ajax request obj
    'use strict';
    var xhr = createXHR();
    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var target = document.getElementById("spinner");
            if (target) {
                document.getElementById("spinner").innerHTML = "";
            }
            walnutEntries = JSON.parse(xhr.responseText);
            displayPage(user, recPtr);
        } else {
            document.getElementById("spinner").innerHTML = "<img src='http://localhost/images/Walnuts/ajax-loader.gif'>";
        }
    };
    xhr.open("GET", "listNuts1.php?value=" + user, true);
    xhr.send(null);
}

// next 2 fxns called by edit nut page
function getOrigNut() {
    // target ID: value=# where # is 7th char
    var nutID = window.location.search.substring(7);
    // get ajax request obj	
    var xhr = createXHR(); 	
    if (!xhr) {
    alert("failed ajax request.");
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function(){	
        if(xhr.readyState == 4 && xhr.status == 200) {
            var s = xhr.responseText;;
            var nut = JSON.parse(s);
            document.forms["editNutForm"].walnutID.value = nut["walnutID"];  //hidden field in form - use value for inserting update
            document.forms["editNutForm"].SirName.value = nut["SirName"];
            document.forms["editNutForm"].Names.value = nut["Names"];
            document.forms["editNutForm"].FormalNames.value = nut["FormalNames"];
            document.forms["editNutForm"].Children.value = nut["Children"];
            document.forms["editNutForm"].Addr1.value = nut["Addr1"];
            document.forms["editNutForm"].Addr2.value = nut["Addr2"];
            document.forms["editNutForm"].Addr3.value = nut["Addr3"];
            document.forms["editNutForm"].Addr4.value = nut["Addr4"];
            document.forms["editNutForm"].Email1.value = nut["Email1"];
            document.forms["editNutForm"].Email2.value = nut["Email2"];
            document.forms["editNutForm"].Email3.value = nut["Email3"];
            document.forms["editNutForm"].Phone1.value = nut["Phone1"];			
            document.forms["editNutForm"].Phone2.value = nut["Phone2"];
            document.forms["editNutForm"].Notes.value = nut["Notes"];
            // display page once fields are loaded
            document.getElementById('body').style.display = 'block';
        }        
    }
    xhr.open("GET", "getNut.php?value=" + nutID,  true);
    xhr.send(null);
}		

function postEditedNut() {
    // get ajax request obj
    var xhr = createXHR(); 	
    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function(){	
        if(xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("editNutResponse").innerHTML=xhr.responseText;
         }
    }
    var editData = getPostDataJSON(true); // true param means form contains walnutID data in hidden input field - autoincrement value in mysql
    xhr.open("POST", "editNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");	
    xhr.send(editData); 
}
        
    
    
    
    