
//this js file is basically a lookup table for when you need to map a fullname to a username and there is no normalization on generated usernames.
var assigneeInputName =input['Assignee'] || 'No assignee name received';

// add users here, second value will be used for targeting name field on xMatters
var assigneeMap = {
    "Firstname Lastname": "flastname",  
};


// gets targetname from fullname
function getAssigneeTargetName(assigneeInputName) {
    if (assigneeMap.hasOwnProperty(assigneeInputName)) {
        return assigneeMap[assigneeInputName];
    } else {
        return "TargetNameNotFound";
    }
}


var assigneeTargetName = getAssigneeTargetName(assigneeInputName);

// creates targetname output to be used later in flows
output['AssigneeTargetName'] = assigneeTargetName;

// some debugging statements
console.log("AssigneeFullName: " + assigneeInputName);
console.log("AssigneeTargetName: " + assigneeTargetName);
