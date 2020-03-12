# Slides.today

Slides.today is a site dedicated to the presentations [@abraham](https://github.com/abraham) and [@pearlbea](https://github.com/pearlbea) give at conferences and meetups.

## Install

Checkout the source with `git checkout git@github.com:abraham/slides-today.git` and run `npm install` from with the `slides-today` directory.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:5000/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npx ng generate component component-name` to generate a new component. You can also use `npx ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/slides-today/` directory. Use the `npm run build:prod` for a production build.

## Tests

Run `npm test` to execute the the test suite. Currently tests mainly comprise of feature tests written in cucumber-js and puppeteer.

If you are writing tests it might be helpful to  `npm run start:prod` in one terminal and `npm run test:features` in another terminal to avoid rebuilding Angular everytime.

To have the browser windows open use so you can see what's rendering (this will also increase timeouts):

    NODE_ENV=debug npm run test:features

To run a specific file and example use:

    npm run test:features features/deck.feature:33

## Deploy

Run `npm run deploy` to build and deploy to Firebase. Firebase Hosting, Firestore, and Functions should be setup and enabled.

## Generate Deck ID

Run `npm run id` to generate a deck ID.

## Get tweet data

Run `npm run get-tweet <id_str>` to get a full Twitter Status object from the API and store it in `tweet.data.json`. Don't forget to add the Status `id_str` to a Deck object.
