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

// fxn called by primary html page WTD.html - only run by admin
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
            openResult = window.open("http://localhost/walnuts/listNuts1.html", "_self"); // listNuts1.html only called by admin
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


// called by ajaxAddNuts and postEditedNut()
function getPostDataJSON(hasID) {
    'use strict';
    var data_json = "", send_data = "";
    if (!hasID) {
        document.forms[0].walnutID.value = null;
    }
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
    addData = getPostDataJSON(false); // false means no walnutID in hidden field since new addition to DB and mysql assigns walnutID
    xhr.open("POST", "addNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(addData);
}


/* called by displayPage to format the notes entered in addNut form */
function wordWrap(str, width, brk, cut) {
    'use strict';
    brk = brk || '\n';
    width = width || 30;
    cut = cut || false;
    if (!str) { return str; }
    var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
    return str.match(new RegExp(regex, 'g')).join(brk);
}

/* function addNewlines(str) {  //havent tried yet
  var result = '';
  while (str.length > 0) {
    result += str.substring(0, 200) + '\n';
    str = str.substring(200);
  }
  return result;
}
*/
/*
function insertNewLines(str) {
    'use strict';
    var pos = 0,            // pos =  position of space in string
        i = 0,                  // iterator
        firstThirtyFlag = false,
        secondThirtyFlag = false,
        posOfSpaces = [],       // array to hold location of spaces in the note string where we can insert \n
        maxLineLen = 30,        // max len of str allowed for our format display is 30 chars
        maxLenFraction = 0,
        maxNoteLen = 90,        // maxNoteLen
        noteLen = str.length,   // length of the note string
        newLineCount = 0,       // # inserted '\n'
        newLinesNeeded = 3,     // # required '\n'
        newLineStr = "<br><br><br>";
    // we want 30 char lines, at most three of them
    // and we want three <br>'s separating the note entry from the top of the next entry
    // if no note we need 3 <br>'s after the empty 'Note:' entry
    // if note length < 30 chars just keep note and add three <br>'s
    //  if note length is > 30 and < 60 chars we have two note lines and need 2 more <br>'s
    // if note length is > 60 ( and it cant be > 90 ) we have 3 lines and need just 1 <br>    
    if (noteLen < maxLineLen) {
        str += "<br><br><br>";
        return str;         // notes need no formatting - less than 30 char in len
    }
    if (noteLen > maxNoteLen) {  // if note > 90 chars need to trim the note to 90 chars
        str = str.substring(0, maxNoteLen);
    }
    // first see if there are any spacesin this string - str.indexOf(' ', 0) returns -1 if none
    pos = str.indexOf(' ', pos);             //find location of first space char
    if (pos === -1) { // here if no spaces in a string which is > 30 chars, garbage
        str = "<br><br><br>";
        return str;
    }
    // since str len > one line (30 chars) needs formatting - find location of spaces where we can put  newlines - ie at ~= 30 and 60                
    for (i = 0; pos >= 0; i += 1) {
        posOfSpaces[i] = pos;
        pos = str.indexOf(' ', pos + 1);     //find location of next space char
        maxLenFraction = (pos / maxLineLen);
        if ((maxLenFraction > 1) && (!firstThirtyFlag)) {
            firstThirtyFlag = true;
            str = str.substr(0, (posOfSpaces[i])) + "<br>"  + str.substr((posOfSpaces[i]) + 1);
            newLineCount += 1;
        }
        if ((maxLenFraction > 2) && (!secondThirtyFlag)) {
            secondThirtyFlag = true;
            str = str.substr(0, (posOfSpaces[i])) + "<br>"  + str.substr((posOfSpaces[i]) + 1);
            newLineCount += 1;
            break;
        }
    }
    str += newLineStr.substr(0, ((newLinesNeeded - newLineCount) * 4)); // each newline is 4 chars, '<br>', right?
    return str;
}
*/


 /* called by ajaxListNuts() fxn below - requester is who is making request, admin or user; nutEntries is arr of all walnuts */
function displayPage(requester, nutEntries) {
    'use strict';
    var numNuts, x, i = 0, replacementStr = "", replacementStrLt = "", replacementStrRt = "", notesStr = "";
    function isEven(value) {
        x = ((value % 2 === 0) ? true : false);
        return x;
    }
    // get # entries in database into var numNuts
    numNuts = nutEntries.length;

    for (i = 0; i < numNuts; i += 1) {
   /*     replacementStr =  "<p><pre><a class='oneNut' href=\"editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "\"" + "title=\"Update\">" +  nutEntries[i].SirName + "</a>"; */
        replacementStr =  "<p><pre><a class='oneNut' href = \"editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "\""  + " title='Update'>" +  nutEntries[i].SirName + "</a>";
        if (requester === 'admin') {
            replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].walnutID + ");' title='Delete'>" + "&times;</a>" + "<br>";
        } else {
            replacementStr += "<br>";
        }
        replacementStr += nutEntries[i].Names + "<br>";
        replacementStr += ((nutEntries[i].FormalNames) ? (nutEntries[i].FormalNames + "<br>") : "<br>");
        replacementStr += ((nutEntries[i].Children) ? (nutEntries[i].Children + "<br>") : "<br>");
        replacementStr += "Address: " + nutEntries[i].Addr1;
        replacementStr += ((nutEntries[i].Addr2) ? ", " + (nutEntries[i].Addr2 + "<br>") : "<br>");
        replacementStr += "         " + nutEntries[i].Addr3 + "<br>";
        replacementStr += "         " + nutEntries[i].Addr4 + "<br>";
        replacementStr += "Email 1: " + nutEntries[i].Email1 + "<br>";
        replacementStr += "      2: " + nutEntries[i].Email2 + "<br>";
        replacementStr += "Phone 1: " + nutEntries[i].Phone1 + "<br>";
        replacementStr += "      2: " + nutEntries[i].Phone2 + "<br>";
        // format any Notes to fit in our listNuts display properly - always print 3 newlines
        notesStr = "Updated " + nutEntries[i].updated + "<br>";
        notesStr += ((nutEntries[i].Notes) ? (wordWrap(nutEntries[i].Notes, 30, '<br>', false)) : "<br><br>");  // if no notes insert 2 newlines
        replacementStr += "Notes:   " + notesStr + "</pre></p>";
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

// fxn called by list nuts html page - which requester determines api
/*jslint browser: true*/
/*global $, jQuery, createXHR, displayPage*/
function ajaxListNuts(requester) {

    // get local ajax request obj
    'use strict';
    var walnutEntries = [], xhr = createXHR();
    if (!xhr) {
        return false;
    }
    // Create a function that will receive data sent from the server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("spinner").innerHTML = "";			
            walnutEntries = JSON.parse(xhr.responseText);
            displayPage(requester, walnutEntries);
            $(".content").mCustomScrollbar({
                mouseWheel: true,
                scrollButtons: {
                    enable: true
                }
            });
            if (requester === 'admin') {
                document.getElementById("mainMenu").style.display = 'block';
            }
        } else {
            document.getElementById("spinner").innerHTML = "<img id='spinner_img' src='http://localhost/walnuts/images/Walnuts/ajax-loader.gif'>";
        }
    };
    //call php fxn to open Walnuts db and retieve/return all records for display
    xhr.open("GET", "listNuts1.php", true);
    xhr.send(null);
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
            // on success, return to listing of walnuts - we know we are 'admin' to be here eh?
                window.open("listNuts1.html", "_self"); // listNuts1.html only called by admin
            }
        };
        xhr.open("GET", "delNut.php?value=" + nutId, true);
        xhr.send(null);
    } else {
        return;
    }
}
// next 2 fxns called by editNut.html page
function getOrigNut(nutID) {
    'use strict';
    // target ID: value=# where # is 7th char
    var s, nut, xhr, i, frm = document.getElementById("editNutForm");
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
            for (i in nut) {
                if (i in frm.elements) {
                    frm.elements[i].value = nut[i];
                }
            }
			return;
        }
    };
    xhr.open("GET", "getNut.php?value=" + nutID,  true);
    xhr.send(null);
}
// called by editNut.html on submit of form
function postEditedNut(requester) {
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
            if (requester === 'admin') {
                window.open("listNuts1.html", "_self"); // listNuts1.html only called by admin
            } else if (requester === 'user') {
                window.open("Walnuts.html", "_self"); // Walnuts.html only called by user
            } else {
                alert("Error: Undefined requester");
                return;
            }
        }
    };
    editData = getPostDataJSON(true); // true param means form contains walnutID data in hidden input field - autoincrement value in mysql
    xhr.open("POST", "editNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(editData);
}
