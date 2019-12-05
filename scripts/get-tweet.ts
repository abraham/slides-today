import * as fs from 'fs';
import * as path from 'path';
import Twit from 'twit';
import twitterCredentials from '../.twitter.json';

const filePath = (id: string) => path.resolve(`./src/assets/statuses/${id}.json`);
const id = process.argv[2];
const client = new Twit({ ...twitterCredentials, strictSSL: true });
const showParams = { id: id, tweet_mode: 'extended', include_entities: true };

if (id) {
  console.log(`Getting tweet ${id}`);

  client.get('statuses/show', showParams, (error, tweet, _response) => {
    if (error) { console.log('ERROR', error); }
    fs.writeFileSync(filePath(id), JSON.stringify(tweet, null, 2));
    console.log(`Updated ${filePath(id)}`);
  });
} else {
  console.log('ID required');
}
