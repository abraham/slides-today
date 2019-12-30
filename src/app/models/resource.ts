import { Service } from './service';

export interface Resource {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Service;
}
