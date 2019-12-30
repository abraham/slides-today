import { Service } from './service';

export interface Link {
  title: string;
  url: string;
  useAsTag: boolean;
  service: Service;
}
