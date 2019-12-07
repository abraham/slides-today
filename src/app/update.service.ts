import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  public $available: Observable<UpdateAvailableEvent>;

  constructor(updates: SwUpdate) {
    this.$available = updates.available;
  }
}
