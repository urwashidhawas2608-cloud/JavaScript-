EVENTORA — EVENT DISCOVERY & REGISTRATION WEBSITE
================================================

HOW TO RUN IN VS CODE
1. Extract the project folder.
2. Open the folder in VS Code.
3. Install the "Live Server" extension if you do not have it.
4. Right-click index.html and select "Open with Live Server".
5. Keep events.json in the same folder. AJAX reads this file, so do not open index.html directly with file://.

FEATURES
- Event cards loaded with jQuery AJAX from events.json.
- Search by event name, category, description or location.
- Category filters and sort options.
- Registration form with input validation.
- Local Storage saves registrations after refresh.
- Cancel registration.
- Host an event form; custom events are saved in Local Storage.
- Responsive dark aesthetic interface.

JAVASCRIPT LAB CONCEPTS
1. DOM manipulation: create/update event cards with jQuery .append(), .html(), .text().
2. Events: click, input, change, submit, keydown and delegated event handlers.
3. Local Storage: localStorage.getItem(), setItem().
4. AJAX: $.ajax() fetches events.json asynchronously.
5. JSON: event data is read from events.json and parsed automatically.
6. Form handling: preventDefault(), validation and dynamic UI updates.

VIVA NOTE
This is a front-end lab demo. Registrations are stored only in the current browser,
not sent to a real server or email service. The AJAX operation loads a local JSON file.
