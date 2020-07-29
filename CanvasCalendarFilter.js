/*
  Name: Canvas Calendar Filter
  Author: Alex Wolfe
  Version: 2.0
  Last Updated: 7/29/2020
  Homepage: https://github.com/afwolfe/CanvasCalendarFilter
  
  Creates separate Google Calendars for Canvas courses.
  
  License: GPLv3 (https://www.gnu.org/licenses/gpl.html)
 
  DIRECTIONS:
  Modify the CONFIGURATION section below and then run updateCalendarsForCourses().
  You can add a trigger to have the calendar update on a regular schedule in the TriggerManager.gs file by running installTriggers().
  
  2.0
  Added delFromSep() to delete events that no longer exist in Canvas.
  Added TriggerManager.gs to assist in easily installing/deleting an automatic 12hr sync.
  
  1.2
  Properly creates all day events. 
  Event descriptions are now copied.
  Checks if a matching event title already exists to improve event creation.
  

  1.1
  Added function to create calendars for multiple courses.

  1.0
  Initial release
  Filters out events in the next 365 days based on a course name into a separate calendar.

*/
function updateCalendarsForCourses() {
    //BEGIN CONFIGURATION
  
  /* 
      Your Canvas Calendar must be in Google Calendar. https://community.canvaslms.com/docs/DOC-10037-4152719670
      Get the Calendar ID by going into Google Calendar, clicking the dropdown arrow next to your calendar and clicking "Calendar Settings."
      Look for "Integrate calendar" and find the "Calendar ID."
      Ex:
      var canvasCalendarId = "l3tt3r5andnumb3rs@import.calendar.google.com";
  */
  
  var canvasCalendarId = "";
  
  // List course name(s) below.
  // The course name is what appears in the [] brackets in the name of the calendar event in the feed.
  // Ex:
  // var courseList = ["English 9", "Social Studies 9", "Algebra I"];
  var courseList = [];
 
  //END CONFIGURATION
  
  
  for (var i=0; i<courseList.length; i++) {
    updateSepCal(canvasCalendarId, courseList[i]);
    
  }
  
}

function updateSepCal(canvasCalendarId, courseName) {
  
  if (canvasCalendarId == "" || courseName == "") {
    throw("It looks like you didn't configure the script. See the comments before trying again.");
  }
  
  var TODAY = new Date();
  var MS_IN_DAY = 1000 * 60 * 60 * 24;
  var YEAR_LATER = new Date(TODAY.getTime()+(MS_IN_DAY*365));

  //Get all events within the next year that match the courseName.
  var canvasCal = CalendarApp.getCalendarById(canvasCalendarId);
  var canvasEvents = canvasCal.getEvents(TODAY, YEAR_LATER, {search: "["+courseName+"]"});
  var sepCalendarName = courseName;

  //Check for and create the separate calendar.
  var sepCalendar = CalendarApp.getCalendarsByName(sepCalendarName);
  if (sepCalendar.length < 1) {
    sepCalendar = CalendarApp.createCalendar(sepCalendarName);
    sepCalendar.setTimeZone(CalendarApp.getTimeZone());
    sepCalendar.setSelected(true);
  } else {
    //If you have more than one calendar with the same name, it will only use the first one it finds.
    sepCalendar = sepCalendar[0];
  }
  
  //Delete events no longer in Canvas from the separate calendar.
  var sepEvents = sepCalendar.getEvents(TODAY, YEAR_LATER);
  sepEvents.forEach(delFromSep);
  
  function delFromSep(item) {
    //Deletes missing events from the separate calendar.
    var tempTitle = item.getTitle() + " [" + courseName + "]";
    var tempStart = item.getStartTime();
    var tempEnd = item.getEndTime();
    var eventList = sepCalendar.getEvents(tempStart, tempEnd);
    if (!isEventInList(eventList, tempTitle)) {
      // If an event in the time range with the same title does not exist, delete it.
      item.deleteEvent();
    }
  }
  

  //Add each new event to the separate calendar.
  canvasEvents.forEach(addToSep);

  function addToSep(item) {
    //Adds each event to the separate calendar.
    var tempTitle = item.getTitle();
    tempTitle = cleanTitle(tempTitle, courseName);
    var tempStart = item.getStartTime();
    var tempEnd = item.getEndTime();
    var eventList = sepCalendar.getEvents(tempStart, tempEnd);
    if (!isEventInList(eventList, tempTitle)) {
      // If an event in the time range with the same title does not exist, create it.
      if (item.isAllDayEvent()) {
        sepCalendar.createAllDayEvent(tempTitle, item.getAllDayStartDate(), {description: item.getDescription()});
      }
      else {
        sepCalendar.createEvent(tempTitle, tempStart, tempEnd, {description: item.getDescription()});
      }
    }
  }
}

function cleanTitle(title, courseName) {
  //Removes the courseName from the event title.
  return title.split(" [" + courseName + "]")[0];
  
}

function isEventInList(eventList, eventTitle) {
  for (var i=0; i<eventList.length; i++)
  {
    if (eventList[i].getTitle() == eventTitle)
      return true;
  }
  return false;
  
}