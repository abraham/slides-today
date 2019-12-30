import { Services } from './service';

export interface Link {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Services;
}
