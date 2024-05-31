//this script extracts any name after Assignee: from an inbound email integration and creates a variable for it to be used in xMatters flows. 
var emailBody = input['InboundEmail'] || 'No email body received';

function extractAssignee(text) {
    var assigneeRegex = /Assignee:\s*(.*)/;
    var match = assigneeRegex.exec(text);
    if (match && match[1]) {
        console.log("Assignee extracted successfully: " + match[1].trim()); 
        return match[1].trim();
    } else {
        console.log("No assignee found in the provided text."); 
        console.log("Received text for parsing: " + text); 
        return 'No assignee found';
    }
}

var assigneeName = extractAssignee(emailBody);
output['Assignee'] = assigneeName;

console.log("Final Assignee Output: " + assigneeName); 
