import { Alpine } from 'alpinejs';
import { Dexie } from 'dexie';
import { app } from './main';

interface IDictionary<TValue> {
  [id: string]: TValue;
}

declare global {
  var Alpine: Alpine
  var dbs: IDictionary<Dexie>
  var app: app
}
