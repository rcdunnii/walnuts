// called by listNuts.html and Walnuts.html
function searchNut() {

   /*  'use strict';  */

    var searchData = $("#searchForm").serialize(), jqxhr, searchElem;
    jqxhr = $.ajax({
   
        type: "POST",
        url: "nutSearch.php",
        data:  searchData // search form single input name is 'nutSearch' so this produces "nutSearch=user_input"
        })
        .done (function (nutID) {
            searchElem = $('#nutSearch');        
            if (nutID === "No Match") {
                TINY.box.show({html:'No match for Sir Name " ' + $("#nutSearch").val() + ' "', width: 300});
                $(searchElem)
                    .val($(searchElem).attr('placeholder'))
                    .focus();
            } else {
                var position = "#nutID_" + nutID;
                $(".content").mCustomScrollbar("scrollTo", position);
                $(searchElem)               
                    .val($(searchElem).attr('placeholder'))
            }           
            $('input[placeholder]').focus(function(ev){ 
              var $this = $(this);
              if ($this.val() === $this.attr('placeholder')) $this.val('');
            }).blur(function(ev){
              var $this = $(this);      
              if ($this.val() === '') $this.val($this.attr('placeholder'));
            })
        })    
        .fail ( function (jqxhr, status, error) {
            alert(jqxhr.responseText);
        });       
}



function getMessageBody(form) {

   /*  'use strict';  */

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

var registering = new Boolean(0);

function setExpiration(cookieLife) {

   /*  'use strict';  */

    var today = new Date(), expr;
    expr = new Date(today.getTime() + cookieLife * 24 * 60 * 60 * 1000);
    return expr.toGMTString();
}

function createCookie(name, value, expires, path, domain, secure) {

   /*  'use strict';  */

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

   /*  'use strict';  */

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

//called from login.html and wtdLogin.html on submit
function ajaxAuthenticate(form, fxn, method) {

   /*  'use strict';  */

    var currentUser,
        data,
        data_json = "",
        errorElem = document.getElementById("loginError"),
        hintLinkElem = document.getElementById("hintLink"),
        i,
        jqxhr,
        pair,
        popUpElem = document.getElementById("popUpImg"),
        pw = false,
        queryVars,
        send_data = "",
        url = "";
        
    if (registering === true) {
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

    data_json += '}';
    send_data = 'value=' + data_json;
    registering = false;

    jqxhr = $.ajax({
        type: method,
        url: fxn,
        data:  send_data,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded"
    });    
    jqxhr.done(function (msg) {
        if (jqxhr.responseText === 'ok') {
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
            errorElem.innerHTML = jqxhr.responseText;
            popUpElem.style.display = "none";
            hintLinkElem.style.display = "block";
        }
    });
     jqxhr.fail(function (msg) {
         alert("An error occurred: " + msg);
     });

    registering = true;
}

// fxn called by primary html page WTD.html - only run by Foxy
function ajaxWalnutFunction(requester) {

   /*  'use strict';  */

    var result,
        user_input,
        jqxhr,
        theHost;

// first get user radio button choice

    user_input = $("input:checked").val();
// production or development ?
    theHost = location.host;
    if (user_input) {
        if (user_input === "deleteNutsDBs") {
            result = (confirm("Are you sure you REALLY want to delete walnuts database?"));
            if (result === false) {
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
            window.open("https://" + theHost + "/listBDays.html?user=" + requester, "_self");
            return false;   // do not remove - otherwise goes to ajax...
        }
        if (user_input === "restoreDB") {
            window.open("https://" + theHost + "/restoreDB.html", "_self");
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
                        "click": function () {$(".redText").fadeOut('slow', function () {$(".redText").remove(); });
                            }
                    }, ".downLoad");
            }
            if (user_input === "createNutsDBs") {
                $("<div />")
                    .addClass("redText")
                    .text(responseData)
                    .appendTo("#response")
                    .fadeOut(10000, function () {
                        $(".redText").remove();
                    });
            }
            if (user_input === "deleteNutsDBs") {
                $("<div />")
                    .addClass("redText")
                    .text(responseData)
                    .appendTo("#response")
                    .fadeOut(10000, function () {
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

   /*  'use strict';  */

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

   /*  'use strict';  */

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
            $('#addNutResponse').css('visibility', 'visible').text(dataReturned);
        },
        complete: function () {
            setTimeout(function () {
                $('#addNutResponse').css('visibility', 'hidden'); /*slideUp('slow'); */
            }, 8000);
        }
    });
}

function ajaxAddBDay() {

   /*  'use strict';  */

    var addBDayData;
    addBDayData = getPostDataJSON("addBDayForm");
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

   /*  'use strict';  */

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

function isEven(value) {

   /*  'use strict';  */

    var x;
    x = ((value % 2 === 0) ? true : false);
    return x;
}

function getMonth(numStr) {

   /*  'use strict';  */

    var monStr = "";

    switch (numStr) {
    case "01":
        monStr = "January";
        break;
    case "02":
        monStr = "February";
        break;
    case "03":
        monStr = "March";
        break;
    case "04":
        monStr = "April";
        break;
    case "05":
        monStr = "May";
        break;
    case "06":
        monStr = "June";
        break;
    case "07":
        monStr = "July";
        break;
    case "08":
        monStr = "August";
        break;
    case "09":
        monStr = "September";
        break;
    case "10":
        monStr = "October";
        break;
    case "11":
        monStr = "November";
        break;
    case "12":
        monStr = "December";
        break;
    }
    return monStr;
}

function displayBDays(requester, nutEntries, idxBy) {

   /*  'use strict';  */

    var dateStr = "",
        i = 0,
        idx = 0,   // str len counter up to xCol
        j = 0,
        lastMonNumStr = "",
        lenFirstName = 0,
        lenNameStr = 0,
        lenSirName = 0,
        loopReplacementStr = "",
        monOffSet = 30, // spaces from start of 1st name to start of the date
        monthName = "",
        numNuts = 0,
        nameStr = "",
        replacementStr = "",
        spaceStr = "",
        spaceToFill = 0,
        theHost = "",
        xCol = 43; // col for delete link 'x'

// development or production ?
    theHost = location.host;
// get # entries in database into var numNuts
    numNuts = nutEntries.length;
	$("#replace").empty().append("<pre><br><center><h2>Birth Dates in Database<br><span style=\"display:inline-block\" class=\"downPointer\">&#10132;</span></h2><center></pre>");
    if (idxBy === "byDate") {
        for (i = 0; i < numNuts; i += 1) {
            if (lastMonNumStr !== nutEntries[i].bDayMM) {
                monthName = getMonth(nutEntries[i].bDayMM);
                lastMonNumStr = nutEntries[i].bDayMM;
                loopReplacementStr += "<span class='monthName'>" + monthName + "</span><br />";
            }
            idx = 0;
            loopReplacementStr += "\u00A0\u00A0\u00A0\u00A0" + nutEntries[i].bDayMM + "-";
            idx += 7;
            loopReplacementStr += nutEntries[i].bDayDD;
            idx += 2;
			loopReplacementStr += ((nutEntries[i].bDayYYYY) ? ("-" + nutEntries[i].bDayYYYY + "\u00A0\u00A0\u00A0") : ("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"));
            idx += 8;
            loopReplacementStr += "<a class=\"oneNut\" onclick= \"window.location.href='https://" + theHost + "/editBDay.html?value=" + nutEntries[i].bDayID + "&user=" + requester + "'\" title = \"Update this Birthday\">" +  nutEntries[i].LastName + "</a>";
            lenSirName = nutEntries[i].LastName.length;
            loopReplacementStr += ",\u00A0";
            idx += (lenSirName + 2);
            loopReplacementStr +=  nutEntries[i].FirstName + "\u00A0";
            lenFirstName =  nutEntries[i].FirstName.length;
            idx += (lenFirstName + 1);
			loopReplacementStr += (nutEntries[i].MiddleInit) ? (nutEntries[i].MiddleInit[0] + "\u00A0") : "\u00A0\u00A0";
            idx += 2;
            spaceToFill = (xCol - idx);

			for (j = 0, spaceStr = ""; j < spaceToFill; j += 1) {
				spaceStr += "\u00A0";
			}


            loopReplacementStr += spaceStr;


            if (requester === 'Foxy') {
                loopReplacementStr += "<a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].bDayID + " , \"" + nutEntries[i].LastName + "\", \"bDays\", \"Foxy\");' title='Delete'>" + "&times;</a>";
            }
            loopReplacementStr += "<br />";
            replacementStr += loopReplacementStr;
            $("#replace").append(replacementStr);
            loopReplacementStr = "";
            replacementStr = "";
        }
    } else {	// list byName
        for (i = 0; i < numNuts; i += 1) {
            loopReplacementStr += "\u00A0\u00A0\u00A0\u00A0<a class=\"oneNut\" onclick= \"window.location.href='https://" + theHost + "/editBDay.html?value=" + nutEntries[i].bDayID + "&user=" + requester + "'\" title = 'Update this Birthday'>";
			nameStr =  nutEntries[i].LastName + "</a>, " + nutEntries[i].FirstName + " " + ((typeof nutEntries[i].MiddleInit[0] !== 'undefined') ? nutEntries[i].MiddleInit[0] : " ");
			lenNameStr = nameStr.length; // may need to debit 4 for the </a> tag part of the string
			loopReplacementStr += nameStr;
			spaceToFill = monOffSet - (lenNameStr - 4);
			for (j = 0, spaceStr = ""; j < spaceToFill; j += 1) {
				spaceStr += ".";
			}
            loopReplacementStr += spaceStr;
			monthName = getMonth(nutEntries[i].bDayMM);
            loopReplacementStr += "<span style=\"color:red\">" + monthName.substring(0, 3) + "</span>" + " ";
            loopReplacementStr += nutEntries[i].bDayDD + " ";
			loopReplacementStr += (nutEntries[i].bDayYYYY !== "") ? nutEntries[i].bDayYYYY : "\u00A0\u00A0\u00A0\u00A0";
            if (requester === 'Foxy') {
                loopReplacementStr += " <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].bDayID + " , \"" + nutEntries[i].LastName + "\", \"bDays\", \"Foxy\");' title='Delete'>" + "&times;</a>";
            }
            loopReplacementStr += "<br />";
            replacementStr += loopReplacementStr;
            $("#replace").append(replacementStr);
            loopReplacementStr = "";
            replacementStr = "";
        }
    }
    $("#replace").append("<pre><br><br></pre>");
    return;
}

var scrollBar = false; // gobal scrollbar exists/nonexists flag

// fxn called by list nuts html page - which requester determines api
function ajaxListBDays(requester, indexedBy) {

   /*  'use strict';  */


    var bDayEntries = [], jqxhr;


    jqxhr = $.ajax({
        type: "GET",
        url: "listBDays.php?value=" + indexedBy,
        beforeSend: function () {
            $("#spinner").show();
            $("#listWalnuts").css('display', 'none');
            $("#mainMenu").css('display', 'none');
        }
    })
        .done(function (dataReturned) {
            $("#spinner").hide();
            bDayEntries  = (JSON && JSON.parse(dataReturned)) || $.parseJSON(dataReturned);
            displayBDays(requester, bDayEntries, indexedBy);
			if (!scrollBar) {
				$(".outer").mCustomScrollbar({
					mouseWheel: true,
					scrollButtons: {
						enable: true
					}
				});
				scrollBar = true;
			} else {
			    $(".outer").mCustomScrollbar("update"); //update scrollbar according to newly loaded content
				$(".outer").mCustomScrollbar("scrollTo", "top", {scrollInertia: 200}); //scroll to top
            }
            if (requester === 'Foxy') {
                $("#mainMenu").css('display', 'block');
                $("#listWalnuts").css('display', 'none');
            } else {
                $("#mainMenu").css('display', 'none');  //if user Walnut don't want admin dashboard link
                $("#listWalnuts").css('display', 'block');
            }
            $("select").change(function () {
                var str = "", option = 0;
                option = $(".sortBy option:selected").attr('myTag');
                str = (option === "1") ? "byDate" : "byName";
                $("#replace").empty();
                ajaxListBDays(requester, str); // ajax call to populate page
            });
        })
        .fail(function (dataReturned) {
            alert("List Birthdays failed" + dataReturned);
        });
}


function displayTable(requester, nutEntries) {

   /*  'use strict';  */

    var numNuts, i = 0,
        replacementStr = "", nutTable = "",
        theHost = "";
// development or production ?
    theHost = location.host;
// get # entries in database into var numNuts
    numNuts = nutEntries.length;

    for (i = 0; i < numNuts; i += 2) {
        if (((i + 1) < numNuts)) {
            replacementStr = "<tr><td><a class='oneNut' id='nutID_" + nutEntries[i].walnutID + "' onclick= \"window.location.href='https://" + theHost + "/editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i].SirName + "</a>    <span class='toPrint'><input type='checkbox' class='toPrintBox' id='"+ nutEntries[i].walnutID + "' title='Print Nut' name='cc'><label for='"+ nutEntries[i].walnutID + "' style='color:green'>(&#x2713; to Print)&#x21E8;<span class='printID_" + nutEntries[i].walnutID + "'></span></label></span>";
  
            if (requester === 'Foxy') {
                replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].walnutID + " , \"" + nutEntries[i].SirName + "\", \"walnuts\", \"Foxy\");' title='Delete'>" + "&times;</a></td><td>";
            } else {
                replacementStr += "</td><td>";
            }
            replacementStr += "<a class='oneNut' id='nutID_" + nutEntries[i + 1].walnutID + "' onclick= \"window.location.href='https://" + theHost + "/editNut.html?value=" + nutEntries[i + 1].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i + 1].SirName + "</a>    <span class='toPrint'><input type='checkbox' class='toPrintBox' id='"+ nutEntries[i + 1].walnutID + "' title='Print Nut' name='cc'><label for='"+ nutEntries[i + 1].walnutID + "' style='color:green'>(&#x2713; to Print)&#x21E8;<span class='printID_" + nutEntries[i + 1].walnutID + "'></span></label></span>";

            if (requester === 'Foxy') {
                replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i + 1].walnutID + " , \"" + nutEntries[i + 1].SirName + "\", \"walnuts\", \"Foxy\");' title='Delete'>" + "&times;</a></td></tr>";
            } else {
                replacementStr += "</td></tr>";
            }
            // set Names
            replacementStr += "<tr><td>" + nutEntries[i].Names + "</td><td>" + nutEntries[i + 1].Names + "</td></tr>";
            // set Formal Names
            replacementStr += "<tr><td>" + nutEntries[i].FormalNames + "</td><td>" + nutEntries[i + 1].FormalNames + "</td></tr>";
            // set Children
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Children' id='Children'>" + "Children:<div class='inlineDiv'>" + nutEntries[i].Children + "</div></td><td class='editable' walnutID='" + nutEntries[i + 1].walnutID + "'" + "name='Children' id='Children'>"  + "Children:<div class='inlineDiv'>" + nutEntries[i + 1].Children + "</div></td></tr>";
            // set Address line 1
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr1' id='Addr1'>" + "Address: <div class='inlineDiv'>" + nutEntries[i].Addr1 + "</div></td><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr1' id='Addr1'>" + "Address: <div class='inlineDiv'>" + nutEntries[i + 1].Addr1 + "</div></div></div></td></tr>";
            // set Address line 2
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr2' id='Addr2'>" + "         <div class='inlineDiv'>" + nutEntries[i].Addr2 + "</div></td><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr2' id='Addr2'>" + "         <div class='inlineDiv'>" + nutEntries[i + 1].Addr2 + "</div></td></div></tr>";
            // set Address line 3
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr3' id='Addr3'>" + "         <div class='inlineDiv'>" + nutEntries[i].Addr3 + "</div></td><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr2' id='Addr3'>" + "         <div class='inlineDiv'>" + nutEntries[i + 1].Addr3 + "</div></td></tr>";
            // set Address line 4
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr4' id='Addr4'>" + "         <div class='inlineDiv'>" + nutEntries[i].Addr4 + "</div></td><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr4' id='Addr4'>" + "         <div class='inlineDiv'>" + nutEntries[i + 1].Addr4 + "</div></td></tr>";
            // set Email 1
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Email1' id='Email1'>" + "Email 1: <div class = 'inlineDiv mailToLink'>" + nutEntries[i].Email1 + "</div></td><td class='editable' walnutID='" + nutEntries[i + 1].walnutID + "'" + "name='Email1' id='Email1'>" + "Email 1: <div class = 'inlineDiv mailToLink'>" + nutEntries[i + 1].Email1 + "</div></td></tr>";
            // set Email  2
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Email2' id='Email2'>" + "      2: <div class = 'inlineDiv mailToLink'>" + nutEntries[i].Email2 + "</div></td><td class='editable' walnutID='" + nutEntries[i + 1].walnutID + "'" + "name='Email2' id='Email2'>" + "      2: <div class = 'inlineDiv mailToLink'>" + nutEntries[i + 1].Email2 + "</div></td></tr>";
            // set Phone  1
            replacementStr += "<tr><td   class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Phone1' id='Phone1'>" + "Phone 1: <div class='inlineDiv'>" + nutEntries[i].Phone1 + "</div></td><td class='editable' walnutID='" + nutEntries[i + 1].walnutID + "'" + "name='Phone1' id='Phone1'>" + "Phone 1: <div class='inlineDiv'>" + nutEntries[i + 1].Phone1 + "</div></td></tr>";
            // set Phone  2
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Phone2' id='Phone2'>" + "      2: <div class='inlineDiv'>" + nutEntries[i].Phone2 + "</div></td><td class='editable' walnutID='" + nutEntries[i + 1].walnutID + "'" + "name='Phone2' id='Phone2'>" + "      2: <div class='inlineDiv'>" + nutEntries[i + 1].Phone2 + "</div></td></tr>";
            
           if ((Date.parse(nutEntries[i].Created)) < (Date.parse(nutEntries[i].Updated))) {
                replacementStr += "<tr><td>Last Update: " + nutEntries[i].Updated.split(" ", 1) + "</td>";
            } else {
                replacementStr += "<tr><td>Last Update: " + nutEntries[i].Created.split(" ", 1) + "</td>";
            }
            
           if ((Date.parse(nutEntries[i + 1].Created)) < (Date.parse(nutEntries[i + 1].Updated))) {
                replacementStr += "<td>Last Update: " + nutEntries[i + 1].Updated.split(" ", 1) + "</td></tr>";
            } else {
                replacementStr += "<td>Last Update: " + nutEntries[i + 1].Created.split(" ", 1) + "</td></tr>";
            }
            
            replacementStr += "<tr><td class='editable-area' walnutID='" + nutEntries[i].walnutID + "'" + "name='Notes' id='Notes'>" + "Notes: <br><div class='inlineDiv textarea'><textarea class='preEdit' rows='3' cols='30' wrap='hard' maxlength='60'>" + nutEntries[i].Notes + "</textarea></div></td><td class='editable-area' walnutID='" + nutEntries[i + 1].walnutID + "'" + "name='Notes' id='Notes'>";

            replacementStr += "Notes:<br><div class='inlineDiv textarea'><textarea class='preEdit' rows='3' cols='30' wrap='hard' maxlength='60'>" + nutEntries[i + 1].Notes + "</textarea></div></td></tr>";
            
            // empty row to separate entries
            replacementStr += "<tr><td>&nbsp;&nbsp;</td><td>&nbsp;&nbsp;</td></tr>";

            nutTable += replacementStr;

            replacementStr = "";
        } else { // if on last nut item
            replacementStr = "<tr><td><a class='oneNut' id='nutID_" + nutEntries[i].walnutID + "' onclick= \"window.location.href='https://" + theHost + "/editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i].SirName + "</a>    <span class='toPrint'><input type='checkbox' class='toPrintBox' id='"+ nutEntries[i].walnutID + "' title='Print Nut' name='cc'><label for='"+ nutEntries[i].walnutID + "' style='color:green'>(&#x2713; to Print)&#x21E8;<span class='printID_" + nutEntries[i].walnutID + "'></span></label></span>";

            if (requester === 'Foxy') {
                replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].walnutID + " , \"" + nutEntries[i].SirName + "\", \"walnuts\", \"Foxy\");' title='Delete'>" + "&times;</a></td><td>";
            } else {
                replacementStr += "</td><tr>";
            }


            replacementStr += "<tr><td>" + nutEntries[i].Names + "</td></tr>";
            replacementStr += "<tr><td>" + nutEntries[i].FormalNames + "</td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Children' id='Children'>" + "Children: <div class='inlineDiv'>" + nutEntries[i].Children + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr1' id='Addr1'>" + "Address: <div class='inlineDiv'>" + nutEntries[i].Addr1 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr2' id='Addr2'>" + "         <div class='inlineDiv'>" + nutEntries[i].Addr2 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr3' id='Addr3'>" + "         <div class='inlineDiv'>" + nutEntries[i].Addr3 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Addr4' id='Addr4'>" + "         <div class='inlineDiv'>" + nutEntries[i].Addr4 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Email1' id='Email1'>" + "Email 1: <div class = 'inlineDiv mailToLink'>" + nutEntries[i].Email1 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Email2' id='Email2'>" + "      2: <div class = 'inlineDiv mailToLink'>" + nutEntries[i].Email2 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Phone1' id='Phone1'>" + "Phone 1: <div class='inlineDiv'>" + nutEntries[i].Phone1 + "</div></td></tr>";
            replacementStr += "<tr><td class='editable' walnutID='" + nutEntries[i].walnutID + "'" + "name='Phone2' id='Phone2'>" + "      2: <div class='inlineDiv'>" + nutEntries[i].Phone2 + "</div></td></tr>";
           // put out last update 
           if ((Date.parse(nutEntries[i].Created)) < (Date.parse(nutEntries[i].Updated))) {
                replacementStr += "<tr><td>Last Update: " + nutEntries[i].Updated.split(" ", 1) + "</td></tr>";
            } else {
                replacementStr += "<tr><td>Last Update: " + nutEntries[i].Created.split(" ", 1) + "</td></tr>";
            }
 
            replacementStr += "<tr><td class='editable-area' walnutID='" + nutEntries[i].walnutID + "'" + "name='Notes' id='Notes'>" + "Notes:<br><div class='inlineDiv textarea'><textarea class='preEdit' rows='3' cols='30' wrap='hard' maxlength='60'>" + nutEntries[i].Notes + "</textarea></div></td><tr>";
            
            // empty row to separate entries
            replacementStr += "<tr><td>&nbsp;&nbsp;</td><td>&nbsp;&nbsp;</td></tr>";
        }

        nutTable += replacementStr;

        replacementStr = "";
    }
    document.getElementById("walnutTable").innerHTML = "<table>" + nutTable + "</table>";
    return;
}

function saveChanges(obj, cancel) { // cancel is 'false' if user wants to save data, or original data in input field if he wants to cancel

    var t, editableClass, editableElem, emptyCellClass;

    if (false === cancel) {
        t = $.trim($(obj).parent().children(':first').val());  //$(obj)=SAVE/CANCEL, parent()=inlinEditDiv,1st child=input field
    } else {
        t = cancel;
    }
    editableClass = $(obj).closest('td').hasClass('editable') ? 'editable' : 'editable-area'; 
    editableElem = $(obj).closest('[class="' + editableClass + '"]');
    
    if (cancel === false) {
    
        $(editableElem).find('.active-inline div').replaceWith('<em class="ajax">Saving...<em>');  

     // post new value to the server
        $.post('save.php', {id: $(editableElem).attr('walnutID'), name: $(editableElem).attr('name'), value: t},
            function (data) {
                if (editableClass === 'editable') {
                    $(editableElem)
                       .find('.active-inline .ajax')
                       .replaceWith(t.length ? t : "                   ");
                 } else {
                    $(editableElem).find('.active-inline').empty().append('<textarea class="preEdit" rows="3" cols="30" wrap="hard" maxlength="60" >' + t + '</textarea>'); 
                }
                if (t.length === 0) {
                    $('.active-inline').addClass('emptyCell'); 
                    emptyCellClass = ''; //i.e. do not remove this class below
                } else {
                    emptyCellClass = 'emptyCell'; // yes include this class for removal below since t not empty
                }    
                $('.active-inline').removeClass('active-inline over-inline ' + emptyCellClass);
            }              
         );
    } else {  // cancel the edit operation
        if (editableClass === 'editable-area') {
            $(obj).closest('div.active-inline')
                .replaceWith('<div class="inlineDiv textarea" title="Quick Edit"><textarea class="preEdit" rows="3" cols="30" wrap="hard" maxlength="60" >' + t + '</textarea></div>'); 
        } else {
            $(obj).closest('div.active-inline')
                .replaceWith('<div class="inlineDiv" title="Quick Edit">' + t + '</div>');              
        }		

    }
     setClickable();
}

// use closure to see if editing already in process
function editingNut() {
    /* 'use strict';*/

    var editing = false;
    return {
        set: function (newVal) {editing = newVal;},
        get: function () { return editing;}
    };
}

var editFlag = editingNut(); // set inline edit flags to prevent 2 at a time edits - uses closures

function setClickable() {

    /* 'use strict';*/
    // select editable fields, some input fields, other textareas; both empty and filled are editable
    // class = 'editable' are input fields (with and without content)
    // class = 'editable-area' are textareas (with and without content), and textarea class= 'preEdit' have content
    var $editableFields = $('.editable div, .editable-area div.textarea, .editable-area div.textarea textarea.preEdit');
    
    // put spaces in empty spans to allow in-line edits - add class emptyCell to empty fields        				

    $editableFields.each(function () {
        if ((!$(this).text().trim().length)) {
                $(this).text("                    ").addClass("emptyCell"); 
        }
    });           

    var $clickableFields = $('.editable div, .editable-area div.textarea');
    
    $clickableFields
    
        .on('mouseover.colorize', function () {
            if ( $(this).hasClass('textarea') && !$(this).hasClass('emptyCell')) {
                $(this)
                    .find('textarea')
                    .addClass('over-inline')
                    .attr('title', 'Quick Edit');
            } else {        
                $(this)
                    .addClass('over-inline')
                    .attr('title', 'Quick Edit');
            }
/*              
            if ($(this).hasClass('mailToLink') && ($.trim($(this).html()).length)) {
                $(this).attr('title', 'Left Click to Edit or Email');
            } else {
               $(this).attr('title', 'Edit');            
            }
*/
        })
        
        .on('mouseout.colorize', function () {
            if ( $(this).hasClass('textarea') && !$(this).hasClass('emptyCell')) {
                $(this)
                    .find('textarea')
                    .removeClass('over-inline')
                    .removeAttr('title');
            } else {        
                $(this)
                    .removeClass('over-inline')
                    .removeAttr('title');
            }
        })
    
       .on('click.inlineEdit', function(event) {
        
            var inputarea,
            textarea,
            button, 
            revert, 
            contents, 
            editElement;
          
         editElement = $(this);
         
         //ignore clicks on element now being edited - has class = 'active-inline' 
        if ($(editElement).hasClass('active-inline')) {
            return;
        } else {
            $(editElement).addClass('active-inline');
        }
        
        // editFlag global object declared/defined above in this file main.js - prevents 2 concurrent edits 
        if (editFlag.get() === false) {
            editFlag.set(true);
        } else {
            TINY.box.show({html:'One Edit at a time!', width: 200});
            $(editElement).removeClass('active-inline');
            return;
        }
        
        // turn off hilite and title while editing field
        $(editElement).off(".colorize").removeClass('over-inline').removeClass('emptyCell').removeAttr('title');
        
        // create html elements for the inline edits, either an input or textarea element, each wrapped in an inline edit (ie) div
        inputarea = '<div class="inlineEditDiv"><input type="text" class="click-inline" size="25" maxlength="50"/>';
        textarea = '<div class="ie_div_txtarea"><textarea rows="3" cols="20" class="click-inline" wrap="hard" maxlength="60">' + $(editElement).text() + '</textarea>';
        button = '<input type="button" value="SAVE" class="saveButton" /><input type="button" value="CANCEL" class="cancelButton" /></div>';
        revert = $(editElement).text(); // no trim since contents pasted back on screen only - not to db
        contents = $.trim($(editElement).text().replace(/\/p>/g, "/p>/p>\n\n"));

        // what form elem needed?              
         if ($(editElement).parent().hasClass('editable')) { // dealing with input field rather than textarea field
            $(editElement)
                .html(inputarea + button)
                .find('input.click-inline')
                .val(contents)
                .focus();
        } else {    // dealing with textarea field 
            $(editElement)
                .html(textarea + '<br>' + button)
                .find('textarea')
                .focus();
        }   
 
        $('.saveButton')
                    .click(function () {
                editFlag.set(false);    
                saveChanges(this, false);
            });

        $('.cancelButton')
                    .click(function () {
                editFlag.set(false);                                                
                saveChanges(this, revert);
            });              
    })
}


function doPrint(nuts) {
    var numItems = nuts.length, i, j, printString ='';
    
    printString = "<p><h1><b><center>Walnuts Directory Listings</center></b></h1><br>";
    
    for (i=0; i < numItems; i++) {
        printString += "&nbsp;<b>" + nuts[i].SirName + "</b><br>";
        printString += "&nbsp;" + nuts[i].Names + "<br>";
        if (nuts[i].FormalNames) {
            printString += "&nbsp;" + nuts[i].FormalNames + "<br>";
        }
        if (nuts[i].Children) {
            printString += "&nbsp;Children:<br>" + nuts[i].Children + "<br>";
        }
        if (nuts[i].Addr1) {
            printString += "&nbsp;Address:<br>" + nuts[i].Addr1 + "<br>";        
        }
        if (nuts[i].Addr2) {
            printString += "&nbsp;" + nuts[i].Addr2 + "<br>";
        }
        if (nuts[i].Addr3) {
            printString += "&nbsp;" + nuts[i].Addr3 + "<br>";
        }
        if (nuts[i].Addr4) {
            printString += "&nbsp;" + nuts[i].Addr4 + "<br>";
        }
        if (nuts[i].Email1) {
             printString += "&nbsp;Email:<br> " + nuts[i].Email1 + "<br>";
        }
        if (nuts[i].Email2) {
             printString += "&nbsp;" + nuts[i].Email2 + "<br>";
        }
        if (nuts[i].Email3) {
             printString += "&nbsp;" + nuts[i].Email3 + "<br>";
        }
        if (nuts[i].Phone1) {
             printString += "&nbsp;Phones:<br>" + nuts[i].Phone1 + "<br>";
        }
        if (nuts[i].Phone2) {
             printString += "&nbsp;" + nuts[i].Phone2 + "<br>";
        }
        if (nuts[i].Notes) {
            printString += "&nbsp;Notes:<br>" + nuts[i].Notes + "<br>";
        }
        printString += "<br><br></p>";
    

        if (i && (i % 4) ) {
            printString += "<p style='page-break-after: always'></p>";
         }
     }
     return(printString);
}     
        

function printElem(data)
    {
        var mywindow;
        
        mywindow = window.open('', 'walnut print window', 'height=400,width=600');
        mywindow.document.write('<html><head><title>walnut printout</title>');
        mywindow.document.write('<link rel="stylesheet" href="/css/print.css" type="text/css" media="print"/>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.print();
        mywindow.close();

        return true;
    }
    
function printNuts() {
    var nutsToPrint = $(".toPrint").find("input:checked");
    var nutArray = [], nutID,jqxhr, nutPrintObj, printEntries, printResult;
    
    if ($(nutsToPrint).length) {
        $(nutsToPrint).each( function() {
            nutID = $(this).attr('id');
            nutArray.push(nutID);
        });
        
        nutPrintObj = { data : nutArray };
        
        jqxhr = $.ajax({
            type: "POST",
            url: "printNuts.php",
            data: nutPrintObj,
            beforeSend: function () {
                $("#spinner").show();
            }
        })
            .done(function (dataReturned) {
                $("#spinner").hide();
                printEntries  = (JSON && JSON.parse(dataReturned)) || $.parseJSON(dataReturned);
                printResult = doPrint(printEntries);                   
                printElem(printResult);
            })
            .fail(function () {
                alert("List Nuts failed");
            });            
    } else {
       TINY.box.show({html:'No Nuts to Print!', width: 200});
    }
}
    
function ajaxListNutsTable(requester, nutID) {
    /* 'use strict';*/

    var walnutEntries = [],
        jqxhr,
        nutIdentifier,
        emailAddr;
       
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
            displayTable(requester, walnutEntries);
            // add mailTo anchor around any filled email address
 /*           
            $('.mailToLink').each(function() {
                emailAddr = $.trim($(this).html());
                if (emailAddr) {
                    $(this).empty();
                    $("<a class= 'emailAnchor' href = 'mailto:" + emailAddr + "'>" + emailAddr + "</a>").appendTo($(this));
                }    
              });          
 */                   
            $(".content").mCustomScrollbar({
                mouseWheel: true,
                scrollButtons: {
                    enable: true
                },
                theme: "light-thick",
                advanced: {
                    autoScrollOnFocus: false,
                    updateOnContentResize: true,
                    updateOnBrowserResize: true
                }
            });

            setClickable();   // inline edit code

            $("div.help img").click(function () {
                TINY.box.show({url: 'help.html', width : 750, height : 450, opacity : 100, mask : true, maskid : "nutFrame", maskopacity : 100});
            });

            $(document).keypress(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which), theHost, tag;
                tag = e.target.tagName.toLowerCase();
                if ( tag !== 'input' && tag !== 'textarea') { 
                    switch (code) {
                    case 65:   //"A"
                    case 97:   //"a"
                        if (!theHost) {
                            theHost = location.host;
                        }
                        window.open("https://" + theHost + "/addNut.html", "_self");
                        break;
                    case 84:   //"T"
                    case 116:  //"t"
                        $(".content").mCustomScrollbar("scrollTo", "top", {scrollInertia: 200}); //scroll to top
                        break;
                    
                    case 66:   //"B"
                    case 98:   //"b"
                        $(".content").mCustomScrollbar("scrollTo", "bottom", {scrollInertia: 200}); //scroll to bottom
                        break;
                    case 80:   //"P"
                    case 112:   //"p"
                        if ($('.toPrint').is(':visible') && $('input.toPrintBox').prop('checked')) {                            
                            printNuts();
                        }    
                        $(".toPrint").toggle(); // show hide print checkboxes
                        break;                    
                    case 83:   //"S"
                    case 115:  //"s"
                        e.preventDefault(); 
                        $("input#nutSearch").focus();
                        break;
                    }
                }
   
            });

           $('input.toPrintBox:checkbox').change (function (event)
            {
                var thisID = $(this).attr('id');
 
                if ($('#' + thisID).prop('checked')) {
                    $(this).siblings().contents().eq(0).wrap("<p />").parent().html("(Hit 'p' to Print)").contents().unwrap();
                    $("label[for=" + thisID + "]").css('color', 'red');
                } else {
                     $(this).siblings().contents().eq(0).wrap("<p />").parent().html("(&#x2713; to Print)&#x21E8;").contents().unwrap();
                     $("label[for=" + thisID + "]").css('color', 'green');
                }                   
            });
            
            
            $(".content").hover(function () {
                $(document).data({"keyboard-input": "enabled"});
                $(this).addClass("keyboard-input");
            }, function () {
                $(document).data({"keyboard-input": "disabled"});
                $(this).removeClass("keyboard-input");
            });

            $(document).keydown(function (e) {
                if ($(this).data("keyboard-input") === "enabled") {
                    var activeElem = $(".keyboard-input"),
                        activeElemPos = Math.abs($(".keyboard-input .mCSB_container").position().top),
                        pixelsToScroll = 60;
                    if (e.which === 38) { //scroll up
                        e.preventDefault();
                        if (pixelsToScroll > activeElemPos) {
                            activeElem.mCustomScrollbar("scrollTo", "top");
                        } else {
                            activeElem.mCustomScrollbar("scrollTo", (activeElemPos - pixelsToScroll), {scrollInertia: 400, scrollEasing: "easeOutCirc"});
                        }
                    } else if (e.which === 40) { //scroll down
                        e.preventDefault();
                        activeElem.mCustomScrollbar("scrollTo", (activeElemPos + pixelsToScroll), {scrollInertia: 400, scrollEasing: "easeOutCirc"});
                    }
                }
            });

            if (requester === 'Foxy') {
                $("#mainMenu").css('display', 'block');
            } else { // only 2 possible requesters - Foxy and Walnut
                $("#editHint").show();
                $("#bDayLink").show();
            }
            var numStr = walnutEntries.length, position;
            $(".numNuts").text(numStr);

            if (nutID) {
                position = '#' + nutID;
                $(".content").mCustomScrollbar("scrollTo", position);
 /*               $('#nutSearch').val("").attr("placeholder", "Search");                                */
            } else {
                $(".content").mCustomScrollbar("scrollTo", "top");
 /*               $('#nutSearch').val("").attr("placeholder", "Search");                */
            }
            
        })
        .fail(function () {
            alert("List Nuts failed");
        });
}


function confirmDel(nutId, Name, dataBase, requester) {

   /*  'use strict';  */

    var jqxhr, thisURL, thisHTML, r = confirm("Really delete " + Name + "?");
    if (dataBase === "walnuts") {
        thisURL = "delNut.php";
        thisHTML = "listNuts.html?user=" + requester;
    } else {
        thisURL = "delBDay.php";
        thisHTML = "listBDays.html?user=" + requester;
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

   /*  'use strict';  */

    var jqxhr,
	    key,
		valOfKey;

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

   /*  'use strict';  */

    var editData, requester, nutID;
    editData = getPostDataJSON("editNutForm");
    $.ajax({
        type: "POST",
        url: "editNut.php",
        data: editData
    })
        .done(function (dataReturned) {
            requester = $("#editNutForm input[name=user]").val();
            nutID = $("#editNutForm input[name=walnutID]").val();
            if (requester === 'Foxy') {
                window.open("listNuts.html?id=nutID_" + nutID, "_self"); // listNuts.html only called by Foxy
            } else if (requester === 'Walnut') {
                window.open("Walnuts.html?id=nutID_" + nutID, "_self"); // Walnuts.html only called by user Walnut
            } else {
                alert("Error: Undefined requester " + requester);
                return;
            }
        })
        .fail(function () {
            $('#editNutResponse').text("Update failed").slideDown('slow');
        });
}

// called by editBDay.html on submit of form
function ajaxEditBDay() {

   /*  'use strict';  */

    var editData, requester;
    editData = getPostDataJSON("editBDayForm");
    $.ajax({
        type: "POST",
        url: "editBDay.php",
        data: editData
    })
        .done(function (dataReturned) {
            $('#editBDayResponse').text(dataReturned);
            requester = $("#editBDayForm input[name=user]").val();
            window.open("listBDays.html?user=" + requester, "_self");
        })
        .fail(function () {
            $('#editBDayResponse').text("Update failed").slideDown('slow');
        })
        .always(function () {
            setTimeout(function () {
                $('#editBDayResponse').slideUp('slow');
            }, 8000);
        });
}

function getOrigBDay(nutID) {

   /*  'use strict';  */

    var key,
	    valOfKey,
	    jqxhr;

    jqxhr = $.ajax({
        dataType: 'json',
        url: "getBDay.php",
        data: "value=" + nutID
    }).done(function (dataReturned) {
        $.each(dataReturned, function (key, valOfKey) {
            $("#editBDayForm " + "[name='" + key + "']").val(valOfKey);
        });
    })
        .fail(function (dataReturned) {
            $('#editBDayResponse').text("error: " + dataReturned).slideDown('slow');
        })
        .always(function () {
            setTimeout(function () {
                $('#editBDayResponse').slideUp('slow');
            }, 8000);
        });
}

function ajaxRestoreDBs(sql) {

   /*  'use strict';  */

    var  jqxhr;

    jqxhr = $.ajax({
        type: "GET",
        url: "restoreDBs.php",
        data: "value=" + sql
    })
        .done(function (dataReturned) {
            $(".restoreResponse").html(dataReturned).slideUp('slow');
            window.location.href = "WTD.html";
        })
        .fail(function (dataReturned) {
            $(".restoreResponse").html(dataReturned);
        });
}