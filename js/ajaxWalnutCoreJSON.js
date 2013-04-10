/*global XMLHttpRequest:true,ActiveXObject:true,document:true,confirm:true*/
/*global window:true,$,alert:true, location,escape */
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

function getMessageBody(form) {
    'use strict';
    var data = "", i, j, option, elem, param, nodeName, type, valueAttr, value;
    for (i = 0; i < form.elements.length; i += 1) {
        elem = form.elements[i];
        if (elem.name) {
            nodeName = elem.nodeName.toLowerCase();
            type = elem.type ? elem.type.toLowerCase() : "";

                // if an input:checked or input:radio is not checked, skip it
            if (nodeName === "input" && (type === "checkbox" || type === "radio")) {
                if (!elem.checked) {
                    continue;
                }
            }

            param = "";
                // select element is special, if no value is specified the text must be sent
            if (nodeName === "select") {
                for (j = 0; j < elem.options.length; j += 1) {
                    option = elem.options[j];
                    if (option.selected) {
                        valueAttr = option.getAttributeNode("value");
                        value = (valueAttr && valueAttr.specified) ? option.value : option.text;
                        if (param !== "") {
                            param += "&";
                        }
                        param += encodeURIComponent(elem.name) + "=" + encodeURIComponent(value);
                    }
                }
            } else {
                param = encodeURIComponent(elem.name) + "=" + encodeURIComponent(elem.value);
            }

            if (data !== "") {
                data += "&";
            }
            data += param;
        }
    }
    return data;
}

var registering = false;
/*
// called from 
function createCookie(name, value, days) {
    'use strict';
    var date = new Date(), expires;
	if (days) {
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	} else {
        expires = "";
    }
	document.cookie = name + "=" + value + expires + "; path=/walnuts" + ;
}
*/

function setExpiration(cookieLife) {
    'use strict';
    var today = new Date(), expr;
    expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
    return expr.toGMTString();
}

function createCookie(name, value, expires, path, domain, secure) {
    'use strict';
    var date = new Date();
	document.cookie = name + "=" + escape(value) + "; ";

	if (expires) {
		expires = setExpiration(expires);
		document.cookie += "expires=" + expires + "; ";
	}
	if (path) {
		document.cookie += "path=" + path + "; ";
	}
	if (domain) {
		document.cookie += "domain=" + domain + "; ";
	}
	if (secure) {
		document.cookie += "secure; ";
	}
}


function readCookie(name) {
    'use strict';
    var nameEQ, ca, i, c;

	nameEQ = name + "=";
	ca = document.cookie.split(';');
	for (i = 0; i < ca.length; i += 1) {
		c = ca[i];
		while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
		if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
	}
	return null;
}

//called from login.html on submit
function ajaxAuthenticate(form, url, method) {
    'use strict';
    var xhr,
        data,
        queryVars,
        i,
        pair,
        pw = false,
        data_json = "",
        send_data = "",
        nutID,
        nutUser,
        errorElem = document.getElementById("loginError"),
        popUpElem = document.getElementById("popUpImg");

	if (registering) {
        return;
    }

    errorElem.innerHTML = "";

    // get message data
    data = getMessageBody(form);
    data_json = '{';
    queryVars = data.split('&');
    for (i = 0; i < queryVars.length; i += 1) {
        pair = queryVars[i].split('=');
        if ((decodeURIComponent(pair[0]) === "password") && (decodeURIComponent(pair[1]))) {
            pw = true;
            data_json += '"' + pair[0] + '" : "' + pair[1] + '"';
        }
        if (decodeURIComponent(pair[0]) === "captcha_code") {
            data_json += ',"' + pair[0] + '" : "' + pair[1] + '"';
        }
    }
    if (!pw) {
        return false;
    }

    data_json += '}';
    send_data = 'value=' + data_json;

	xhr = createXHR();

    if (!xhr) {
	    return false;
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 0 || xhr.readyState === 4) {
		    registering = false;
		    // prevent memory leaks
		    xhr.onreadystatechange = null;

            if ((xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status === 1223)) {
				if (xhr.responseText === "ok") {    // login is successful - redirection is required
                    createCookie('nutCookie', 'loggedIn', '60000', '', '', 1);
                    nutID = form.elements.walnutID.value;  // these two are hidden vals in the login.html form
                    nutUser = form.elements.user.value;
					location.href = "/walnuts/editNut.html?value=" + nutID + "&user=" + nutUser;
				} else {
                    errorElem.innerHTML = xhr.responseText;
                    popUpElem.style.display = "none";
                }
			} else {
				alert("An error occurred while logging in. Please try it again.");
			}
	    }
    };

    try {
		xhr.open(method, url, true);   // true means asynchron, where url is login.php and method is POST	
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(send_data);
    } catch (e) {
        alert("Cannot connect to the server!");
        return;
    }

    registering = true;
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
            openResult = window.open("https://localhost/walnuts/addNut.html", "_self");
            return false;
        }
        if (user_input === "list") {
            openResult = window.open("https://localhost/walnuts/listNuts1.html", "_self"); // listNuts1.html only called by admin
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
    data_json = '{"walnutID": "' + document.forms[0].walnutID.value + '","SirName":"' + document.forms[0].SirName.value + '","Names":"' + document.forms[0].Names.value + '","FormalNames":"' + document.forms[0].FormalNames.value + '","Children":"' + document.forms[0].Children.value + '","Addr1":"' + document.forms[0].Addr1.value + '","Addr2"  : "' + document.forms[0].Addr2.value + '","Addr3"  : "' + document.forms[0].Addr3.value + '","Addr4"  : "' + document.forms[0].Addr4.value + '","Email1" : "' + document.forms[0].Email1.value + '","Email2" : "' + document.forms[0].Email2.value + '","Email3" : "' + document.forms[0].Email3.value + '","Phone1" : "' + document.forms[0].Phone1.value + '","Phone2" : "' + document.forms[0].Phone2.value + '","Notes"  : "' + document.forms[0].Notes.value + '", "Created" : "", "Updated" : ""}';
    send_data = 'value=' + data_json;
    return send_data;
}

function ajaxAddNuts() {
    'use strict';
    var addData, xhr, validEm = false, emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (document.getElementById('SirName').value.length === 0) {
        alert('Need Family Name! Try again...');
        document.forms[0].SirName.focus();
        return true;
    }
    if (document.getElementById('Email1').value.length !== 0) {
        validEm = emailPattern.test(document.getElementById('Email1').value);
        if (false === validEm) {
            alert('Invalid 1st Email field');
            document.forms[0].Email1.focus();
            return true;
        }
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
    addData = encodeURI(addData);
    xhr.send(addData);
}

function getParameterByName(name) {
    'use strict';
    var regexS, regex, results;

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    regexS = "[\\?&]" + name + "=([^&#]*)";
    regex = new RegExp(regexS);
    results = regex.exec(window.location.search);

    if (results === null) {
        return "";
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
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

function isEven(value) {
    'use strict';
	var x;
	x = ((value % 2 === 0) ? true : false);
	return x;
}

 /* called by ajaxListNuts() fxn below - requester is who is making request, admin or user; nutEntries is arr of all walnuts */
function displayPage(requester, nutEntries) {
    'use strict';
    var numNuts, x, i = 0,
        replacementStr = "", replacementStrLt = "", replacementStrRt = "", onClickHTML = "",
        notesStr, b = 0, numBrks = 0, brksNeeded = 3, loggedInStatus = 'false',
        onClickObj = { loginStr: "login.html", noLoginStr: "editNut.html" };

/*  onClickObj above has 2 strings:
  1) string used to call login page if user not yet logged in
    loginStr = "\"window.location.href='https://localhost/walnuts/login.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" ";
  2) string used to bypass login if user already logged in - go right to edit page directly
    noLoginStr = "\"window.location.href='https://localhost/walnuts/editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" ";
*/
    loggedInStatus = readCookie('nutCookie');
    if (loggedInStatus) {
        onClickHTML =  onClickObj.noLoginStr;  // here if already logged in, so go right to edit nut fxn
    } else if (loggedInStatus === null) {
        onClickHTML = onClickObj.loginStr;     // here if not... so log in
    } else {
        alert("login status is befuddled - line 3199 ajaxWalnutCoreJSON.js - loggedInStatus = " + loggedInStatus);
    }

    // get # entries in database into var numNuts
    numNuts = nutEntries.length;

    for (i = 0; i < numNuts; i += 1) {
        replacementStr = "<p><pre><a class='oneNut' onclick= \"window.location.href='https://localhost/walnuts/" + onClickHTML + "?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i].SirName + "</a>";

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
        notesStr = ""; //  init after each loop
        if ((Date.parse(nutEntries[i].Created)) < (Date.parse(nutEntries[i].Updated))) {
            notesStr = "<span class=\"updated\">Last Update: " + nutEntries[i].Updated + "</span><br>";
        }
        if (nutEntries[i].Notes) {
            notesStr += wordWrap(nutEntries[i].Notes, 30, '<br>', false);
        }
        numBrks = (notesStr.split(/<br.*?>/gi).length - 1);  // grab # <br>'s in note string 
        // format any Notes to fit in our listNuts display properly - always print 4 newlines
        for (b = numBrks; b < brksNeeded; b += 1) {
            notesStr += "<br>";
        }
        replacementStr += "Notes:   " + notesStr + "</pre></p>";
        if (isEven(i)) {
            replacementStrLt += replacementStr;
        } else {
            replacementStrRt += replacementStr;
        }
        replacementStr = "";
    }
    document.getElementById("replaceLt").innerHTML = replacementStrLt;
    document.getElementById("replaceRt").innerHTML = replacementStrRt;
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
            document.getElementById("spinner").innerHTML = "<img id='spinner_img' src='https://localhost/walnuts/images/ajax-loader.gif'>";
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
function postEditedNut() {
    'use strict';
    // get ajax request obj
    var requester,
        editData,
   // Create a function that will receive data sent from the server
        xhr = createXHR();
    if (!xhr) {
        return false;
    }

    requester = document.forms[0].user.value;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("editNutResponse").innerHTML = xhr.responseText;
            if (requester === 'admin') {
                window.open("listNuts1.html", "_self"); // listNuts1.html only called by admin
            } else if (requester === 'Walnut') {
                window.open("Walnuts.html", "_self"); // Walnuts.html only called by user Walnut
            } else {
                alert("Error: Undefined requester " + requester);
                return;
            }
        }
    };
    editData = getPostDataJSON(true); // true param means form contains walnutID data in hidden input field - autoincrement value in mysql
    xhr.open("POST", "editNut.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(editData);
}
