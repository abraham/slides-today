import * as fs from 'fs';
import * as path from 'path';
import Twit from 'twit';
import twitterCredentials from '../.twitter.json';
import allTweets from '../src/app/tweets.data.json';

const dataFilePath = path.resolve('./src/app/tweets.data.json');
const client = new Twit({ ...twitterCredentials, strictSSL: true });

const work = Object.keys(allTweets).map(async (id: string) => {
  console.log(`Getting tweet ${id}`);
  const showParams = { id: id, tweet_mode: 'extended', include_entities: true };
  try {
    const { data } = await client.get('statuses/show', showParams);
    (allTweets as { [index: string]: any })[id] = data;
  } catch (e) {
    console.log('ERROR', id, e.message);
  }
});

Promise.all(work).then(() => {
  fs.writeFileSync(dataFilePath, JSON.stringify(allTweets, null, 2));
  console.log('Updated tweets.data.json');
});
