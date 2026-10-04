import { TestBed } from '@angular/core/testing';
import decks from './decks.data.json';
import events from './events.data.json';
import { DECKS, EVENTS, SPEAKERS, SPONSORS, TAGS } from './repositories';
import speakers from './speakers.data.json';
import sponsors from './sponsors.data.json';
import tags from './tags.data.json';

describe('repositories', () => {
  it.each([
    ['DECKS', DECKS, decks],
    ['EVENTS', EVENTS, events],
    ['SPEAKERS', SPEAKERS, speakers],
    ['SPONSORS', SPONSORS, sponsors],
    ['TAGS', TAGS, tags],
  ])('%s lists the JSON data', async (_name, token, data) => {
    expect(await TestBed.inject(token).list()).toEqual(data);
  });
});
