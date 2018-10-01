#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Twitter = require('twitter');

const twitterCredentials = require(path.resolve('./.twitter.json'));
const dataFilePath = path.resolve('./src/app/tweets.data.json');
const allTweets = require(dataFilePath);

const id = process.argv[2];
const client = new Twitter(twitterCredentials);

console.log(`Getting tweet ${id}`);

client.get('statuses/show', { id: id, tweet_mode: 'extended', include_entities: true }, (error, tweet, response) => {
  if(error) { console.log('ERROR', error); }
  allTweets[id] = tweet;
  fs.writeFileSync(dataFilePath, JSON.stringify(allTweets, null, 2));
  console.log('Updated tweets.data.json');
});
