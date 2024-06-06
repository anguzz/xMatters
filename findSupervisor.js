//finds supervisor using xMatters endpoint.
//ensure that xmatters has "include endpoint" enabled and that xMatters is the endpoint type is xMatters

var AssigneeTargetName = input['AssigneeTargetName'] || 'No assignee name received';
console.log('Received Assignee Target Name: ' + AssigneeTargetName);

if (AssigneeTargetName === 'No assignee name received') {
    console.log('No assignee target name provided. Exiting the script.');
    return; 
}

// Function to make HTTP request and extract manager's name
function getManager(targetName) {
    var request = http.request({
        "endpoint": "xMatters",
        "path": "/api/xm/1/people/" + encodeURIComponent(targetName) + "/supervisors",
        "method": "GET"
    });

    try {
        var response = request.write();
        //output raw JSON response body for debugging
        console.log('HTTP Response Status Code: ' + response.statusCode);
        if (response.statusCode === 200) {
            console.log('Raw JSON Output:', response.body); 
            output['ManagerJSONOutput'] = response.body;

        } else {
            console.log('Error fetching supervisors with status code: ' + response.statusCode);
        }
    } catch (error) {
        console.log('Exception caught during HTTP request:', error.message);
    }
}
getManager(AssigneeTargetName);
