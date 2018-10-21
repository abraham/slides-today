import { Link } from './link';

export interface Speaker {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  bio: string;
  links: Link[];
}
