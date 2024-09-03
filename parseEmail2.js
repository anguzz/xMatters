/******************************************************************************
Script by: Angel Santoyo
Created: 9-3-24
Notes: this script extracts any name after Email: from an inbound email integration and creates a variable Assignee that can be used to identify and find a user on xMatters, this can be used as a variable 
******************************************************************************/

var emailBody = input['InboundEmail'] || 'No email body received';

function extractAssignee(text) {
    // make the regex capture the username part from the email line
    var assigneeEmailRegex = /Email:\s*(\w+)@/;
    var match = assigneeEmailRegex.exec(text);
    if (match && match[1]) {
        console.log("Assignee username extracted successfully: " + match[1].trim()); 
        return match[1].trim();
    } else {
        console.log("No assignee username found in the provided text."); 
        console.log("Received text for parsing: " + text); 
        return 'No assignee username found';
    }
}

function extractIncidentNumber(text) {
    var incidentRegex = /IR-\d+/;
    var match = incidentRegex.exec(text);
    if (match) {
        console.log("Incident number extracted successfully: " + match[0].trim());
        return match[0].trim();
    } else {
        console.log("No incident number found in the provided text."); 
        console.log("Received text for parsing: " + text); 
        return 'No incident number found';
    }
}

function extractIDNumber(text) {
    var idRegex = /ID:\s*IR-(\d+)/;
    var match = idRegex.exec(text);
    if (match && match[1]) {
        console.log("ID number extracted successfully: " + match[1].trim()); 
        return match[1].trim();
    } else {
        console.log("No ID number found in the provided text."); // Log failure to find the ID number
        console.log("Received text for parsing: " + text);
        return 'No ID number found';
    }
}

var assigneeUsername = extractAssignee(emailBody);
var incidentNumber = extractIncidentNumber(emailBody);
var idNumber = extractIDNumber(emailBody);

output['Assignee'] = assigneeUsername;
output['IncidentNumber'] = incidentNumber;
output['IDNumber'] = idNumber;

console.log("Final Assignee Username Output: " + assigneeUsername); 
console.log("Final Incident Number Output: " + incidentNumber); 
console.log("Final ID Number Output: " + idNumber);
