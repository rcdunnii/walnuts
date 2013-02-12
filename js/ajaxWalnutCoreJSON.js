/*global XMLHttpRequest:true,ActiveXObject:true,document:true,confirm:true*/
/*global window:true,$,alert:true*/
//fxn to create XMLHttpRequest objects
function createXHR() {
    'use strict';
    try {
        return new XMLHttpRequest();
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e1) {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
}

// fxn called by primary html page WT.html
function ajaxWalnutFunction() {
    'use strict';
    var xhr, i, user_input, openResult, walnutOptionChoices;// The variable that makes Ajax possible!

// first get user radio button choice
    walnutOptionChoices = document.getElementsByName("walnuts");
    for (i = 0; i < walnutOptionChoices.length; i += 1) {
        if (walnutOptionChoices[i].checked) {
            user_input = walnutOptionChoices[i].value;
            break;
        }
    }

    if (user_input) {
        if (user_input === "deleteDB") {
            if (!(confirm("Are you sure you REALLY want to delete walnuts database?"))) {
                return false;// delete database aborted
            }
        }
        if (user_input === "add") {
            openResult = window.open("http://localhost/walnuts/addNut.html", "_self");
            return false;
        }
        if (user_input === "list") {
            openResult = window.open("http://localhost/walnuts/listNuts1.html", "_self"); /* , "scrollbars=1" */
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
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("response").innerHTML = xhr.responseText;
        }
    };
    xhr.open("GET", "walnutAction.php?value=" + user_input,  true);
    xhr.send(null);
}



function getPostDataJSON() {
    'use strict';
    var data_json = "", send_data = "";
    data_json = '{"walnutID": "' + document.forms[0].walnutID.value + '","SirName":"' + document.forms[0].SirName.value + '","Names":"' + document.forms[0].Names.value + '","FormalNames":"' + document.forms[0].FormalNames.value + '","Children":"' + document.forms[0].Children.value + '","Addr1":"' + document.forms[0].Addr1.value + '","Addr2"  : "' + document.forms[0].Addr2.value + '","Addr3"  : "' + document.forms[0].Addr3.value + '","Addr4"  : "' + document.forms[0].Addr4.value + '","Email1" : "' + document.forms[0].Email1.value + '","Email2" : "' + document.forms[0].Email2.value + '","Email3" : "' + document.forms[0].Email3.value + '","Phone1" : "' + document.forms[0].Phone1.value + '","Phone2" : "' + document.forms[0].Phone2.value + '","Notes"  : "' + document.forms[0].Notes.value + '"}';
    send_data = 'value=' + data_json;
    return send_data;
}

function ajaxAddNuts() {
    'use strict';
    var addData, xhr;
    if (document.getElementById('SirName').value.length === 0) {
        document.getElementById('addNutResponse').innerHTML = 'Need more Info! Try again...';
        return false;
    }

    // get local ajax request obj
    xhr = createXHR();

    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("addNutResponse").innerHTML = xhr.responseText;
        }
    };
    addData = getPostDataJSON();
    xhr.open("POST", "addNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(addData);
// clear the form once sent
// document.getElementById('addNutForm').reset();

}
function confirmDel(nutId) {
    'use strict';
    var xhr, r = confirm("Are you sure?");
    if (r === true) {
        xhr = createXHR();
        if (!xhr) {
            return false;
        }
    // Create a function that will receive data sent from the server
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById("delNutResponse").innerHTML = xhr.responseText;
            }
        };
        xhr.open("GET", "delNut.php?value=" + nutId, true);
        xhr.send(null);
    } else {
        return;
    }
}




 /* called by ajaxListNuts() fxn below - user is who is making request, admin or gen user, target is where to start the display in database */
function displayPage(user, nutEntries) {
    'use strict';
    var numNuts, x, i = 0, replacementStr = "", replacementStrLt = "", replacementStrRt = "";
    function isEven(value) {
        x = ((value % 2 === 0) ? true : false);
        return x;
    }
    // get # entries in database into global var numNuts
    numNuts = nutEntries.length;

    for (i = 0; i < numNuts; i += 1) {
        replacementStr =  "<p><pre><a class='oneNut'" + "href='editNut.html?value=" + nutEntries[i].walnutID + "' + title='Update'>" + nutEntries[i].SirName + "</a>";
        if (user === 'admin') {
            replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].walnutID + ");' title='Delete'>" + "&times;</a>" + "<span id='delNutResponse'></span>" + "<br>";
        }
        replacementStr += nutEntries[i].Names + "<br>";
        replacementStr += ((nutEntries[i].FormalNames) ? (nutEntries[i].FormalNames + "<br>") : "");
        replacementStr += ((nutEntries[i].Children) ? (nutEntries[i].Children + "<br>") : "");
        replacementStr += "Address: " + nutEntries[i].Addr1 + "<br>";
        replacementStr += ((nutEntries[i].Addr2) ? "         " + (nutEntries[i].Addr2 + "<br>") : "");
        replacementStr += "         " + nutEntries[i].Addr3 + "<br>";
        replacementStr += "         " + nutEntries[i].Addr4 + "<br>";
        replacementStr += "Email 1: " + nutEntries[i].Email1 + "<br>";
        replacementStr += "      2: " + nutEntries[i].Email2 + "<br>";
        replacementStr += "Phone 1: " + nutEntries[i].Phone1 + "<br>";
        replacementStr += "      2: " + nutEntries[i].Phone2 + "<br>";
        replacementStr += "Notes:   " + nutEntries[i].Notes + "<br>" + "</pre>" + "<br><br>";
        if (isEven(i)) {
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
/*global $, jQuery, createXHR, displayPage*/
function ajaxListNuts(user) {
//call php fxn to open Walnuts db and retieve/return all records for display

    // get local ajax request obj
    'use strict';
    var walnutEntries = [];
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
            displayPage(user, walnutEntries);
        } else {
            document.getElementById("spinner").innerHTML = "<img src='http://localhost/images/Walnuts/ajax-loader.gif'>";
        }
    };
    xhr.open("GET", "listNuts1.php?value=" + user, true);
    xhr.send(null);
}

// next 2 fxns called by edit nut page
function getOrigNut() {
    'use strict';
    // target ID: value=# where # is 7th char
    var s, nut, xhr, nutID = window.location.search.substring(7);
    // get ajax request obj
    xhr = createXHR();
    if (!xhr) {
        alert("failed ajax request.");
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            s = xhr.responseText;
            nut = JSON.parse(s);
            document.forms.editNutForm.walnutID.value = nut.walnutID;  //hidden field in form - use value for inserting update
            document.forms.editNutForm.SirName.value = nut.SirName;
            document.forms.editNutForm.Names.value = nut.Names;
            document.forms.editNutForm.FormalNames.value = nut.FormalNames;
            document.forms.editNutForm.Children.value = nut.Children;
            document.forms.editNutForm.Addr1.value = nut.Addr1;
            document.forms.editNutForm.Addr2.value = nut.Addr2;
            document.forms.editNutForm.Addr3.value = nut.Addr3;
            document.forms.editNutForm.Addr4.value = nut.Addr4;
            document.forms.editNutForm.Email1.value = nut.Email1;
            document.forms.editNutForm.Email2.value = nut.Email2;
            document.forms.editNutForm.Email3.value = nut.Email3;
            document.forms.editNutForm.Phone1.value = nut.Phone1;
            document.forms.editNutForm.Phone2.value = nut.Phone2;
            document.forms.editNutForm.Notes.value = nut.Notes;
            // display page once fields are loaded
            document.getElementById('body').style.display = 'block';
        }
    };
    xhr.open("GET", "getNut.php?value=" + nutID,  true);
    xhr.send(null);
}

function postEditedNut() {
    'use strict';
    // get ajax request obj
    var editData, xhr = createXHR();
    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("editNutResponse").innerHTML = xhr.responseText;
        }
    };
    editData = getPostDataJSON(true); // true param means form contains walnutID data in hidden input field - autoincrement value in mysql
    xhr.open("POST", "editNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(editData);
}




