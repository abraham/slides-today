import * as fs from 'fs';
import * as path from 'path';
import Twit from 'twit';
import twitterCredentials from '../.twitter.json';
import allTweets from '../src/app/tweets.data.json';

const dataFilePath = path.resolve('./src/app/tweets.data.json');
const id = process.argv[2];
const client = new Twit({ ...twitterCredentials, strictSSL: true } as Twit.Options);

if (id) {
  console.log(`Getting tweet ${id}`);

  client.get('statuses/show', { id: id, tweet_mode: 'extended', include_entities: true }, (error, tweet, _response) => {
    if (error) { console.log('ERROR', error); }
    (allTweets as { [index: string]: any })[id] = tweet;
    fs.writeFileSync(dataFilePath, JSON.stringify(allTweets, null, 2));
    console.log('Updated tweets.data.json');
  });
} else {
  console.log('ID required');
}
