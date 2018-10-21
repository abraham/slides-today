# Slides.today

Slides.today is a site dedecated to the presentations [@abraham](https://github.com/abraham) and [@pearlbea](https://github.com/pearlbea) give at conferences and meetups.

## Install

Checkout the source with `git checkout git@github.com:abraham/slides-today.git` and run `npm install` from with the `slides-today` directory.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npx ng generate component component-name` to generate a new component. You can also use `npx ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/slides-today/` directory. Use the `npm run build:prod` for a production build.

## Tests

_Note: Tests have a limited implementation currently._

Run `npm test` to execute the the test suite.

## Deploy

Run `npm run deploy` to build and deploy to Firebase. Firebase Hosting, Firestore, and Functions should be setup and enabled.

## Generate Deck ID

Run `npm run id` to generate a deck ID.

## Get tweet data

Run `npm run get-tweet <id_str>` to get a full Twitter Status object from the API and store it in `tweet.data.json`. Don't forget to add the Status `id_str` to a Deck object.
