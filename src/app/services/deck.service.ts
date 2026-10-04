import { Injectable, inject, signal } from '@angular/core';
import { Deck } from '../models/deck';
import { DECKS } from '../repositories';
import { DataService } from './data.service';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private readonly repository = inject(DECKS);
  private readonly dataService = inject(DataService);
  private readonly eventService = inject(EventService);
  private readonly decksState = signal<Deck[] | undefined>(undefined);
  readonly loaded = this.fetchDecks();

  // Undefined until the deck data has loaded.
  readonly decks = this.decksState.asReadonly();

  async get(id: string | null): Promise<Deck | undefined> {
    const decks = await this.loaded;
    return decks.find(deck => deck.id === id);
  }

  async getByLegacyId(id: string | null): Promise<Deck | undefined> {
    const decks = await this.loaded;
    return decks.find(deck => deck.legacyId === id);
  }

  filter(
    tagIds: string[],
    speakerIds: string[] = [],
    eventIds: string[] = [],
  ): Deck[] | undefined {
    return this.decks()?.filter(
      deck =>
        tagIds.every(tag => deck.tags.includes(tag)) &&
        speakerIds.every(speaker => deck.speakerIds.includes(speaker)) &&
        eventIds.every(event => deck.eventIds.includes(event)),
    );
  }

  private async fetchDecks(): Promise<Deck[]> {
    const [data] = await Promise.all([
      this.repository.list(),
      this.dataService.loaded,
      this.eventService.loaded,
    ]);
    const tags = this.dataService.tags();
    const decks = data
      .filter(deck => !deck.archived)
      .map(
        deck =>
          new Deck(
            deck,
            deck.events.map(({ eventId, occurrenceId }) =>
              this.eventService.occurrence(eventId, occurrenceId),
            ),
            tags,
          ),
      );
    this.decksState.set(decks);
    return decks;
  }
}
