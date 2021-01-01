import * as fs from 'fs';
import * as path from 'path';
import Twit from 'twit';
import twitterCredentials from '../.twitter.json';

const filePath = (name: string) =>
  path.resolve(`./src/assets/statuses/${name}.json`);
const id = process.argv[2];
const client = new Twit({ ...twitterCredentials, strictSSL: true });
const showParams = {
  id,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  include_entities: true,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  tweet_mode: 'extended',
};

if (id) {
  console.log(`Getting tweet ${id}`);

  client.get('statuses/show', showParams, (error, tweet, _response) => {
    if (error) {
      console.log('ERROR', error);
    } else {
      fs.writeFileSync(filePath(id), JSON.stringify(tweet, null, 2));
      console.log(`Updated ${filePath(id)}`);
    }
  });
} else {
  console.log('ID required');
}
