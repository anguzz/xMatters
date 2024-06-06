//parse json body using regex to use it as a target id 

var ManagerJSON = input['ManagerJSONOutput'] || '{"data":[]}'; 

function extractTargetName(jsonString) {
    // defines the regex pattern to find "targetName":"value"
    var regex = /"targetName":"([^"]+)"/;
    var match = regex.exec(jsonString);

    if (match && match[1]) {
        console.log('Extracted Target Name:', match[1]);
        return match[1]; //return extractedname
    } else {
        console.log('Target name not found.');
        return 'Target name not found';
    }
}

var targetName = extractTargetName(ManagerJSON);
output['SupervisorTargetID'] = targetName;
