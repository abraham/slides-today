import { Services } from './service';

export interface Resource {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Services;
}
