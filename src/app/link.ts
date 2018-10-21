import { Service } from './service';

export interface Link {
  title: string;
  url: string;
  tag: boolean;
  service: Service;
}
