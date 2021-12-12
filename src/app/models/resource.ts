import { Services } from '../services';

export interface Resource {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Services;
}
