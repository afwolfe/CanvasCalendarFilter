function installTriggers() {
  var userProperties = PropertiesService.getUserProperties(); 
  var properties = userProperties.getProperties();
  
  //Check if each of the triggers have an ID (are currently installed)
  var syncTriggerID = properties["syncTrigger"];
  
  if (!syncTriggerID) {
    // Sync every 12 hours.
    var syncTrigger = ScriptApp.newTrigger('updateCalendarsForCourses')
    .timeBased()
    .everyHours(12)
    .create();
    
    userProperties.setProperty("syncTrigger", syncTrigger.getUniqueId()); //Remember the ID for the user to delete it later.
  }
  else {throw ("Trigger is already installed. Stopping.");}
}

function deleteTriggers() {
  var userProperties = PropertiesService.getUserProperties();
  var properties = userProperties.getProperties();
  var syncTriggerID = properties["syncTrigger"];
  
  if (syncTriggerID) {
    deleteTriggerById(syncTriggerID);
    
    userProperties.deleteProperty("syncTrigger");
  }
  else {throw ("Trigger is not currently installed. Stopping.");}
}

function deleteTriggerById(triggerId) {
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[i].getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}