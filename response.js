/******************************************************************************
Custom Integration to forward xMatters event 
Acknowledgements to update ChangeGear (CG) Incidents with:
- set xMatters 'Acceptor' as CG Incident 'Assigned To'
- move Incident from 'New' to 'In-Progress' (through CG config)
- set SLA text to 'Critical 1 - xMatters'


 ******************************************************************************/
 
console.log('Value of the TicketId:' + event.properties.TicketId);
console.log('Value of the Description:' + event.properties.Description);
console.log('Value of the event identifier:' + event.eventId);
/** The callback triggering time is included in the payload of all triggers **/
console.log('Time: ' + respondedTo.at);
/** These properties are available from the response and respondedTo objects. **/
console.log('\nResponse properties:');
console.log('Recipient: ' + respondedTo.by.targetName);
console.log('Responded with: ' + response.response);
console.log('From this device: ' + response.deviceName);

//If Response is 'Acknowledge', perform integration. Otherwise quit.
// console.log('\n\nEvent Stringified;\n'+ JSON.stringify(event) +'\n\n');
if(response.response == "Acknowledge"){

//Print 'event' object to view contents.
var stringEvent = JSON.stringify(event);
console.log(stringEvent);
//Find index of incident ID from the URL sent in the email body, then save the incident OID to 'inc_id'.
var inc_indx = stringEvent.indexOf('ID=');
var inc_id = stringEvent.substring(inc_indx+3,inc_indx+9);
console.log('Found CG Incident ID: ' + inc_id);
//Save the username of the acceptor with the appended email address (% encoded '@' symbol to later send in the API URL to CG)
var acceptor = '' + respondedTo.by.targetName + '%40niagarawater.com';

//Display extracted information
console.log('NEEDED INFORMATION BEFORE CG API:');
console.log('CGIncident ID: ' + inc_id);
console.log('Accepted By: ' + acceptor);

/************************************************** 
              ChangeGear API Calls 
**************************************************/

// API - AUTHENTICATE CHANGEGEAR SESSION
//Initialize the variable we want to get from the API
var auth = '';
//Initialize the request with the proper endpoint, URL path, method, and headers
var request = http.request({ 
     "endpoint": "ChangeGear Auth/PUT",
     "path": "/CGRestAPI/api/authenticate/user",
     "method": "POST",
     "headers": {
         "Content-Type": "application/json",
         "Content-Length": 52,
         "Connection": "keep-alive"
     }
});
//Set 'Body' information to be passed in the API Call
// - in this case, username/password to validate session
var data = {};
data.username = '';
data.password = '';
//Make the call and save/print the response
var response = request.write(data);
console.log("Response Stringified: "+JSON.stringify(response));
//If API properly returns, save the CG session ID to authenticate below API Calls
if (response.statusCode == 200 ) {
  json = JSON.parse(response.body);
  auth = json.sessionId;
  console.log( "Retrieved sessionid: " + auth);
}

// API - GET USER ID OF ACCEPTOR
user = "";
//'Path' here asks to return columns (object)'ID' and 'Email' from the CG Person object whose 'Email is like user's email saved above'
//'Session ID' (auth) must be passed in the header for all API calls following authentication.
var request = http.request({ 
     "endpoint": "ChangeGear GET",
     "path": "/CGRestAPI/api/entity/Person?columns=ID&columns=Email&filter=[Email]+like+'"+acceptor+"'",
     "method": "GET",
     "headers": {
         "Content-Type": "application/json",
         "sessionid": auth
     }
 });
var response = request.write();
console.log("Stringified response: "+JSON.stringify(response));
//If response comes back properly, save the Person's object ID in 'user' to later update the incident
//*Note* API returns an array of users that match the search criteria (should only be one). This is why data is accessed for first object in the array.
if (response.statusCode == 200 ) {
  json = JSON.parse(response.body);
  console.log( "Retrieved PersonID: " + json[0].ID);
  console.log( "Retrieved Email: " + json[0].Email);
  user = json[0].ID;
}

// API - GET INCIDENT ETAG TO EDIT
//CG Incidents use eTag field as a versioning system for objects
//so that they are only edited by one user at a time
etag = 0;
//'Path' accesses the CG Incident by object ID (saved above)
var request = http.request({ 
     "endpoint": "ChangeGear GET",
     "path": "/CGRestAPI/api/entity/iincidentrequest/"+inc_id,
     "method": "GET",
     "headers": {
         "Content-Type": "application/json",
         "sessionid": auth
     }
 });
var response = request.write();
console.log("Stringified response: "+JSON.stringify(response));
//If API returns properly, save the etag so that the incident can be updated
if (response.statusCode == 200 ) {
  json = JSON.parse(response.body);
  console.log( "Retrieved etag: " + json[0].eTag);
  etag = json[0].eTag;
}

// API - PUT INCIDENT UPDATE OF ACCEPTED-BY USER ID
//Flag to log if update is successful
updated = "False";
var request = http.request({ 
     "endpoint": "ChangeGear Auth/PUT",
     "path": "/CGRestAPI/api/incidentrequest/"+inc_id,
     "method": "PUT",
     "headers": {
         "Content-Type": "application/json",
         "sessionid": auth
     }
});
//Prepare API body with incident eTag, user ID, and update SLA text
var data = {}
data.eTag = etag;
data.AssignedTo = user;
data.SLAStage = "Escalation 1 - xMatters";
var response = request.write(data);
console.log("Stringified response: "+JSON.stringify(response));
if (response.statusCode == 200 ) {
  json = JSON.parse(response.body);
  updated = "True";
}

console.log("Successfully updated: " + updated);

} else { //If user response is 'Escalate' instead of 'Acknowledge', print this.
    console.log("Incident Escalated.");
}
