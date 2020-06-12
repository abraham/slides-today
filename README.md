# Slides.today

Slides.today is a site dedicated to the presentations [@abraham](https://github.com/abraham) and [@pearlbea](https://github.com/pearlbea) give at conferences and meetups.

## Install

Checkout the source with `git checkout git@github.com:abraham/slides-today.git` and run `npm install` from with the `slides-today` directory.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:5000/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npx ng generate component component-name` to generate a new component. You can also use `npx ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the production project. The build artifacts will be stored in the `dist/slides-today/` directory.

## Tests

Tests mainly comprise of feature tests written in cucumber-js and puppeteer.

Build and serve a production version of the app with `npm run serve` then run `npm test`.

To have the browser windows open so you can see what's rendering (this will also increase timeouts), use:

    NODE_ENV=debug npm test

To run a specific file and example use:

    npm test features/deck.feature:33

## Deploy

Deploys happen automatically after merging to the `main` branch.

To do it manually run `npm run deploy` to build and deploy to Firebase. Firebase Hosting, Firestore, and Functions should be setup and enabled.

## Generate Deck ID

Run `npm run id` to generate a deck ID.

## Get tweet data

Run `npm run get-tweet <id_str>` to get a full Twitter Status object from the API and store it in `tweet.data.json`. Don't forget to add the Status `id_str` to a Deck object.
