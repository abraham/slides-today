import { Services } from '../services';

export interface Link {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Services;
}
