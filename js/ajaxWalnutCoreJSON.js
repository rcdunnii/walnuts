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

function setExpiration(cookieLife) {
    'use strict';
    var today = new Date(), expr;
    expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
    return expr.toGMTString();
}

function createCookie(name, value, expires, path, domain, secure) {
    'use strict';
/*    var date = new Date(); */
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
function ajaxAuthenticate(form, fxn, method) {
    'use strict';
    var xhr,
        data,
        queryVars,
        i,
        pair,
        currentUser,
        url = "",
        pw = false,
        data_json = "",
        send_data = "",
        errorElem = document.getElementById("loginError"),
        popUpElem = document.getElementById("popUpImg"),
        hintLinkElem = document.getElementById("hintLink");

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
            if (decodeURIComponent(pair[0]) === "captcha_code") {
                data_json += ',"' + pair[0] + '" : "' + pair[1] + '"';
            }
            if (decodeURIComponent(pair[0]) === "user") {
                currentUser = decodeURIComponent(pair[1]);
            }
        }
        if (!pw) {
            errorElem.innerHTML = "Password incorrect!";
            popUpElem.style.display = "none";
            hintLinkElem.style.display = "block";
            return false;
        }
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
                    if (currentUser === "Walnut") {
                        createCookie('nutCookie', 'loggedIn', '60000', '', '', 1);
                        window.location.href = "Walnuts.html";
                    } else if (currentUser === "Foxy") {
                        createCookie('foxyCookie', 'loggedIn', '60000', '', '', 1);
                        window.location.href = "WTD.html";
                    } else {
                        alert("Unknown User Error");
                        return false;
                    }
                } else {
                    errorElem.innerHTML = xhr.responseText;
                    popUpElem.style.display = "none";
                    hintLinkElem.style.display = "block";
                }
            } else {
                alert("An error occurred while logging in. Please try it again.");
            }
        }
    };

    try {
/*        url = 'https://' + location.host + '/walnuts/' + fxn;   */
        url =  fxn;
        xhr.open(method, url, true);   // true means asynchron, where url is login.php and method is POST
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(send_data);
    } catch (e) {
        alert("Cannot connect to the server!");
        return;
    }

    registering = true;
}

// fxn called by primary html page WTD.html - only run by Foxy
function ajaxWalnutFunction() {
    'use strict';
    var user_input,
        jqxhr,
        theHost;

// first get user radio button choice

    user_input = $("input:checked").val();
// production or development ?
    theHost = location.host;
    if (user_input) {
        if (user_input === "deleteNutsDB") {
            if (!(confirm("Are you sure you REALLY want to delete walnuts database?"))) {
                return false;// delete database aborted
            }
        }
        if (user_input === "addNut") {
            window.open("https://" + theHost + "/addNut.html", "_self");
            return false;   // do not remove - otherwise goes to ajax...
        }
        if (user_input === "listNuts") {
            window.open("https://" + theHost + "/listNuts.html", "_self"); // listNuts.html only called by Foxy
            return false;   // do not remove - otherwise goes to ajax...
        }
        if (user_input === "addBDay") {
            window.open("https://" + theHost + "/addBDay.html", "_self");
            return false;   // do not remove - otherwise goes to ajax...
        }
        if (user_input === "listBDays") {
            window.open("https://" + theHost + "/listBDays.html", "_self");
            return false;   // do not remove - otherwise goes to ajax...
        }
    } else {
        $("<div />")
            .addClass("redText")
            .text("No choice selected!")
            .appendTo("#response")
            .fadeOut(5000, function () {
                $(".redText").remove();
            });
        return false;  // nada checked
    }
    jqxhr = $.ajax({
        type: "GET",
        url: "walnutAction.php",
        data: "value=" + user_input
    })
        .done(function (responseData) {
            if (user_input === "bkUpDB") {
                $("<div />")
                    .addClass("redText")
                    .html(responseData)
                    .appendTo("#response")
                    .on({
                        "click": function (e) {$(".redText").fadeOut('slow', function () {$(".redText").remove(); });
                            }
                    }, ".downLoad");
            }
            if (user_input === "createNutsDB") {
                $("<div />")
                    .addClass("redText")
                    .text(responseData)
                    .appendTo("#response")
                    .fadeOut(5000, function () {
                        $(".redText").remove();
                    });
            }
            if (user_input === "createNutsBdayDB") {
                $("<div />")
                    .addClass("redText")
                    .text(responseData)
                    .appendTo("#response")
                    .fadeOut(5000, function () {
                        $(".redText").remove();
                    });
            }
        })
        .fail(function () {
            alert("Error: " + jqxhr.responseText);
        });
}

// called by ajaxAddNuts(), ajaxEditNut(), ajaxAddBDay()
function getPostDataJSON(theForm) {
    'use strict';
    var data_json = "";

    $.fn.serializeObject = function () {
        var a = this.serializeArray(), o = {};
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    data_json = $("#" + theForm).serializeObject();
    if (theForm === "addNutForm") {
        data_json.Created = "";
        data_json.Updated = "";
    }

    return {data: data_json};
}

function ajaxAddNuts() {
    'use strict';

    var addData;
    addData = getPostDataJSON("addNutForm");
    $.ajax({
        type: "POST",
        url: "addNut.php",
        data: addData,
        error: function () {
            $('#addNutResponse').text("Update failed").slideDown('slow');
        },
        success: function (dataReturned) {
            $('#addNutResponse').text(dataReturned);
        },
        complete: function () {
            setTimeout(function () {
                $('#addNutResponse'); /*.slideUp('slow'); */
            }, 8000);
        }
    });
}

function ajaxAddBDay() {
    'use strict';

    var addBDayData;
    addBDayData = getPostDataJSON("addBdayForm");
    $.ajax({
        type: "POST",
        url: "addBDay.php",
        data: addBDayData,
        success: function (dataReturned) {
            $('#addBDayResponse').text(dataReturned);
        },
        fail: function () {
            $('#addBDayResponse').text("Update failed").slideDown('slow');
        },
        complete: function () {
            setTimeout(function () {
                $('#addBDayResponse'); /*.slideUp('slow'); */
            }, 8000);
        }
    });
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

function displayBDays(requester, nutEntries) {
    'use strict';
    var numNuts, i = 0,
        replacementStr = "",
        loopReplacementStr = "",
        theHost = "",
        innerHeight; // height of inner div
// development or production ?
    theHost = location.host;
// get # entries in database into var numNuts
    numNuts = nutEntries.length;
    replacementStr = "<pre><br><br></pre>"; // add blank lines at top of list
    for (i = 0; i < numNuts; i += 1) {
        loopReplacementStr +=  nutEntries[i].bDayMM + "-";
        loopReplacementStr += nutEntries[i].bDayDD + " ";
        loopReplacementStr += "<a class='oneNut' onclick= \"window.location.href='https://" + theHost + "/editBDay.html?value=" + nutEntries[i].bDayID + "&user=" + requester + "'\" title = 'Update this Birthday'>" +  nutEntries[i].LastName + "</a> ";
        if (requester === 'Foxy') {
            loopReplacementStr += "<a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].bDayID + " , \"" + nutEntries[i].LastName + "\", \"bDays\");' title='Delete'>" + " &times;</a> ";
        }
        loopReplacementStr +=  nutEntries[i].FirstName + " ";
        loopReplacementStr +=  nutEntries[i].MiddleInit + " ";
        loopReplacementStr +=  nutEntries[i].bDayYYYY + "<br></pre>";
        replacementStr += loopReplacementStr;
        loopReplacementStr = "";
    }
    replacementStr += "<pre><br><br></pre>"; // add blank lines at end of list
/*   document.getElementById("replace").innerHTML = replacementStr;   */
    $("#replace").html(replacementStr);

    innerHeight = (36 * numNuts) + 300;  //  36px is 24 px + 1.5 line height; 300 empirical.... 
    $(".inner").height(innerHeight);

    return;
}

// fxn called by list nuts html page - which requester determines api
/*jslint browser: true*/
/*global $, jQuery, createXHR, displayPage*/
function ajaxListBDays(requester) {
    'use strict';

    var bDayEntries = [], jqxhr;

    jqxhr = $.ajax({
        type: "GET",
        url: "listBDays.php",
        beforeSend: function () {
            $("#spinner").show();
        }
    })
        .done(function (dataReturned) {
            $("#spinner").hide();
            bDayEntries  = (JSON && JSON.parse(dataReturned)) || $.parseJSON(dataReturned);
            displayBDays(requester, bDayEntries);
            $(".outer").mCustomScrollbar({
                mouseWheel: true,
                scrollButtons: {
                    enable: true
                }
            });
            if (requester === 'Foxy') {
                $("#mainMenu").css('display', 'block');
            }
        })
        .fail(function () {
            alert("List Birthdays failed");
        });
}


/* called by ajaxListNuts() fxn below - requester is who is making request, Foxy or user; nutEntries is arr of all walnuts */
function displayPage(requester, nutEntries) {
    'use strict';
    var numNuts, i = 0,
        replacementStr = "", replacementStrLt = "", replacementStrRt = "",
        notesStr, b = 0, numBrks = 0, brksNeeded = 5, theHost = '';
// development or production ?
    theHost = location.host;
// get # entries in database into var numNuts
    numNuts = nutEntries.length;

    for (i = 0; i < numNuts; i += 1) {

        replacementStr = "<pre><a class='oneNut' onclick= \"window.location.href='https://" + theHost + "/editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i].SirName + "</a>";

        if (requester === 'Foxy') {
            replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].walnutID + " , \"" + nutEntries[i].SirName + "\", \"walnuts\");' title='Delete'>" + "&times;</a>" + "<br>";
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
        notesStr = ""; //  inits after each loop
        numBrks = 0;

        if (nutEntries[i].Notes.length) { // if notesStr longer than 30 chars, format for display
            notesStr = wordWrap(nutEntries[i].Notes, 30, '<br>', true);
//           notesStr = notesStr.substring(0, 85); // trim to avoid 3rd nl                
            numBrks = (notesStr.split(/<br.*?>/gi).length - 1);  // grab # <br>'s in note string
        // format any Notes to fit in our listNuts display properly - always print 4 newlines            
        }

        if ((Date.parse(nutEntries[i].Created)) < (Date.parse(nutEntries[i].Updated))) {
            notesStr = "<span class=\"updated\">Last Update: " + nutEntries[i].Updated + "</span><br>" + notesStr;
            numBrks += 1; // because we've added 1 <br> in line above...
        }

        for (b = numBrks; b < brksNeeded; b += 1) {
            notesStr += "<br>";
        }

        replacementStr += "Notes:   " + notesStr + "</pre>";
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
    'use strict';

    var walnutEntries = [], jqxhr;

    jqxhr = $.ajax({
        type: "GET",
        url: "listNuts.php",
        beforeSend: function () {
            $("#spinner").show();
            if (requester === 'Walnut') {
                $("#editHint").hide();
            }
        }
    })
        .done(function (dataReturned) {
            $("#spinner").hide();
            walnutEntries  = (JSON && JSON.parse(dataReturned)) || $.parseJSON(dataReturned);
            displayPage(requester, walnutEntries);
            $("body").removeClass("loading");
            $(".content").mCustomScrollbar({
                mouseWheel: true,
                scrollButtons: {
                    enable: true
                }
            });
            if (requester === 'Foxy') {
                $("#mainMenu").css('display', 'block');
            } else { // only 2 possible requesters - Foxy and Walnut
                $("#editHint").show();
            }
        })
        .fail(function () {
            alert("List Nuts failed");
        });
}

function confirmDel(nutId, Name, dataBase) {
    'use strict';

    var jqxhr, thisURL, thisHTML, r = confirm("Really delete " + Name + "?");
    if (dataBase === "walnuts") {
        thisURL = "delNut.php";
        thisHTML = "listNuts.html";
    } else {
        thisURL = "delBDay.php";
        thisHTML = "listBDays.html";
    }
    if (r === true) {
        jqxhr = $.ajax({
            type : "GET",
            url : thisURL,
            data : "value= " + nutId
        })
            .done(function () {
                window.open(thisHTML, "_self");
            })
            .fail(function () {
                alert("Delete failed ID: " + nutId);
            });
    }
}

// next 2 fxns called by editNut.html page
function getOrigNut(nutID) {
    'use strict';

    var key, valOfKey, jqxhr;

    jqxhr = $.ajax({
        dataType: 'json',
        url: "getNut.php",
        data: "value=" + nutID
    }).done(function (dataReturned) {
        $.each(dataReturned, function (key, valOfKey) {
            $("#editNutForm " + "[name='" + key + "']").val(valOfKey);
        });
    })
        .fail(function (dataReturned) {
            $('#editNutResponse').text("error: " + dataReturned).slideDown('slow');
        })
        .always(function () {
            setTimeout(function () {
                $('#editNutResponse').slideUp('slow');
            }, 8000);
        });
}

// called by editNut.html on submit of form
function ajaxEditNut() {
    'use strict';

    var editData, requester;
    editData = getPostDataJSON("editNutForm");
    $.ajax({
        type: "POST",
        url: "editNut.php",
        data: editData
    })
        .done(function (dataReturned) {
            $('#editNutResponse').text(dataReturned);
            requester = $("#editNutForm input[name=user]").val();
            if (requester === 'Foxy') {
                window.open("listNuts.html", "_self"); // listNuts.html only called by Foxy
            } else if (requester === 'Walnut') {
                window.open("Walnuts.html", "_self"); // Walnuts.html only called by user Walnut
            } else {
                alert("Error: Undefined requester " + requester);
                return;
            }
        })
        .fail(function () {
            $('#editNutResponse').text("Update failed").slideDown('slow');
        })
        .always(function () {
            setTimeout(function () {
                $('#editNutResponse').slideUp('slow');
            }, 8000);
        });
}