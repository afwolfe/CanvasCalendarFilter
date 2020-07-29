# CanvasCalendarFilter
A Google Apps Script for Google Calendar to create separate course calendars from the Canvas LMS calendar feed.


## Setup and Configuration
1. Make sure you've subscribed to your calendar already (See: [How do I subscribe to the Calendar feed using Google Calendar as an instructor?](https://community.canvaslms.com/docs/DOC-12793-4152719670))
2. Make a copy of the script for yourself: [CanvasCalendarFilter - Google Apps Script](https://script.google.com/d/1m32NxxZRhK2V4JEUYxFCD5R5RX6cwqbPMHWEsEeI5i2AFXt4L3HXgQm5/edit?usp=sharing)
3. Find the section that says "BEGIN CONFIGURATION"
    1. `canvasCalendarID` is Google Calendar's unique ID for your Canvas Calendar
    2. Click the dropdown arrow next to your calendar in the Google Calendar left sidebar
    3. Click "Calendar Settings"
    4. Find the section labeled "Integrate calendar" and find "Calendar ID"
    5. Paste it between the quotes on the line that says:
        
        `var canvasCalendarId = "";`

4. `courseList` is a list of the courses that you want to make calendars for. This should match the name of the course in your calendar feed. (ie. if an event is called "Lesson 1.1 [Algebra I]", then you should put "Algebra I" in the list.
    * Make sure they match the example (quotes and commas!)
    * `var courseList = ["English 9", "Social Studies 9", "Algebra I"];`


## Using the Script

### Manually
1. After finishing the setup, you should manually run the script by selecting "updateCalendarsForCourses" and clicking the play button at the top of Google Apps Script to initially sync all of the calendars.
2. This will manually create separate calendars for each of the courses you named in courseList, but won't keep them updated.


### Automatically (recommended)
1. You can create what's called a "trigger" to have Google Apps Script automatically run the script on a schedule.
2. We're going to create a "Manual trigger" to run the sync every 12 hours.
    1. Switch to the "TriggerManager.gs" in the left sidebar.
    2. Select `installTriggers` and click the play button at the top: 
    3. If you'd like to tweak the trigger to run on a different schedule, read more at: [Installable Triggers  |  Apps Script  |  Google Developers ](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_manually)
3. You should still run the sync manually at least once before waiting on the trigger to kick in! (See above.)

### Disabling the Automatic Trigger
1. Go back to TriggerManager.gs and select `deleteTriggers` from the list of commands (just like when you installed the trigger).
2. Alternatively, delete the whole script file from the File menu!
