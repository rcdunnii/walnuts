function displayTable(requester, nutEntries) {
    'use strict';
    var numNuts, i = 0,
        replacementStr = "", nutTable = "",
        noteStr = "", b = 0, numBrks = 0, brksNeeded = 5, theHost = "";
// development or production ?
    theHost = location.host;
// get # entries in database into var numNuts
    numNuts = nutEntries.length;

    for (i = 0; i < numNuts; i += 2) {

        replacementStr = "<tr><td><pre><a class='oneNut' id='nutID_" + nutEntries[i].walnutID + "' onclick= \"window.location.href='https://" + theHost + "/editNut.html?value=" + nutEntries[i].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i].SirName + "</a>";

        if (requester === 'Foxy') {
            replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i].walnutID + " , \"" + nutEntries[i].SirName + "\", \"walnuts\", \"Foxy\");' title='Delete'>" + "&times;</a></td><td>";
        } else {
            replacementStr += "</td><td>";
        }
        replacementStr += "<a class='oneNut' id='nutID_" + nutEntries[i + 1].walnutID + "' onclick= \"window.location.href='https://" + theHost + "/editNut.html?value=" + nutEntries[i + 1].walnutID + "&user=" + requester + "'\" title = 'Update this Walnut'>" +  nutEntries[i + 1].SirName + "</a>";

        if (requester === 'Foxy') {
            replacementStr += "                    <a class='oneNut' href='#' onclick='confirmDel(" + nutEntries[i + 1].walnutID + " , \"" + nutEntries[i + 1].SirName + "\", \"walnuts\", \"Foxy\");' title='Delete'>" + "&times;</a></td></tr>";
        } else {
            replacementStr += "</td></tr>";
        }

        replacementStr += "<tr><td>" + nutEntries[i].Names + "</td><td>" + nutEntries[i + 1].Names + "</td></tr>";
        replacementStr += "<tr><td>" + nutEntries[i].FormalNames + "</td><td>" + nutEntries[i + 1].FormalNames + "</td></tr>";
        replacementStr += "<tr><td>" + "Children: " + nutEntries[i].Children + "</td><td>" + "Children: " + nutEntries[i + 1].Children + "</td></tr>";
        replacementStr += "<tr><td>" + "Address: " + nutEntries[i].Addr1 + "</td><td>" + "Address: " + nutEntries[i + 1].Addr1 + "</td></tr>";
        replacementStr += "<tr><td>" + "         " + nutEntries[i].Addr2 + "</td><td>" + "         " + nutEntries[i + 1].Addr2 + "</td></tr>";
        replacementStr += "<tr><td>" + "         " + nutEntries[i].Addr3 + "</td><td>" + "         " + nutEntries[i + 1].Addr3 + "</td></tr>";
        replacementStr += "<tr><td>" + "         " + nutEntries[i].Addr4 + "</td><td>" + "         " + nutEntries[i + 1].Addr4 + "</td></tr>";
        replacementStr += "<tr><td>" + "Email 1: " + nutEntries[i].Email1 + "</td><td>" + "Email 1: " + nutEntries[i + 1].Email1 + "</td></tr>";
        replacementStr += "<tr><td>" + "      2: " + nutEntries[i].Email2 + "</td><td>" + "      2: " + nutEntries[i + 1].Email2 + "</td></tr>";
        replacementStr += "<tr><td>" + "Phone 1: " + nutEntries[i].Phone1 + "</td><td>" + "Phone 1: " + nutEntries[i + 1].Phone1 + "</td></tr>";
        replacementStr += "<tr><td>" + "      2: " + nutEntries[i].Phone2 + "</td><td>" + "      2: " + nutEntries[i + 1].Phone2 + "</td></tr>";
        noteStr = ""; //  inits after each loop
        numBrks = 0;

        if (nutEntries[i].Notes.length) { // if noteStr longer than 30 chars, format for display
            noteStr = wordWrap(nutEntries[i].Notes, 30, '<br>', true);
            numBrks = (noteStr.split(/<br.*?>/gi).length - 1);  // grab # <br>'s in note string
        // format any Notes to fit in our listNuts display properly - always print 4 newlines            
        }

        if ((Date.parse(nutEntries[i].Created)) < (Date.parse(nutEntries[i].Updated))) {
            noteStr = "<span class=\"updated\">Last Update: " + nutEntries[i].Updated + "</span><br>" + noteStr;
            numBrks += 1; // because we've added 1 <br> in line above...
        }

        for (b = numBrks; b < brksNeeded; b += 1) {
            noteStr += "<br>";
        }

        replacementStr += "<tr><td>" + "Notes:   " + noteStr + "</td><td>";
        noteStr = "";
        if (nutEntries[i + 1].Notes.length) { // if noteStr longer than 30 chars, format for display
            noteStr = wordWrap(nutEntries[i + 1].Notes, 30, '<br>', true);
            numBrks = (noteStr.split(/<br.*?>/gi).length - 1);  // grab # <br>'s in note string
        // format any Notes to fit in our listNuts display properly - always print 4 newlines            
        }

        if ((Date.parse(nutEntries[i + 1].Created)) < (Date.parse(nutEntries[i + 1].Updated))) {
            noteStr = "<span class=\"updated\">Last Update: " + nutEntries[i + 1].Updated + "</span><br>" + noteStr;
            numBrks += 1; // because we've added 1 <br> in line above...
        }

        for (b = numBrks; b < brksNeeded; b += 1) {
            noteStr += "<br>";
        }

        replacementStr += "Notes:   " + noteStr + "</pre>" + "</td></tr>";

        nutTable += replacementStr;

        replacementStr = "";
    }
    document.getElementById("walnutTable").innerHTML = "<table>" + nutTable + "</table>";
    return;
}