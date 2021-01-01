import * as fs from 'fs';
import * as path from 'path';
import Twit from 'twit';
import twitterCredentials from '../.twitter.json';
import decks from '../src/app/decks.data.json';

const filePath = (id: string) =>
  path.resolve(`./src/assets/statuses/${id}.json`);
const client = new Twit({ ...twitterCredentials, strictSSL: true });
const ids = decks.flatMap(({ tweetIds }) => tweetIds);

const work = ids.map(async (id: string) => {
  console.log(`Getting tweet ${id}`);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const showParams = { id, tweet_mode: 'extended', include_entities: true };
  try {
    const { data } = await client.get('statuses/show', showParams);
    fs.writeFileSync(filePath(id), JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('ERROR', id, e.message);
  }
});

Promise.all(work).then(() => {
  console.log(`Updated ${work.length} tweets.`);
});
