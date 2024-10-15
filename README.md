# Softgames Challenge

Project has been setup using firebase cli.
The firebase emulator was used for all of the testing purposes.

Three main tools were used:
- firestore - NoSQL database for the application
- functions - backend of the application, composed by four 2nd gen cloud functions
    - delete - deletes a given game
    - update - updates a given game
    - add - adds a new game
    - populate - populates the entire database using the provided url.
- web_app - frontend of the application, SPA React app built using vite.
    - For styling tailwind was used.
    - For state managament, Redux Toolkit was used.

Unfortunately, there was not enough time to write unit tests.

Production version can be found at https://softgames-challenge-pmlm.web.app/. The database has been reset.

In order to run development version, don't forget to, as usual, npm install first.

Feel free to reach out in case any other clarification is required.

Pedro Lima Monteiro