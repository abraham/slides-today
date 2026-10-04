import { Services } from '../services';

// A link as stored in the data, where `service` is not yet narrowed to `Services`.
export interface RawLink {
  title: string;
  url: string;
  useAsTag: boolean;
  service: string;
}

export interface Link {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Services;
}
