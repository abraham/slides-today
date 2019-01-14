import { Color } from './color';

export interface Tag {
  id: string;
  primaryColor: Color;
  complementaryColor: Color;
}

export interface TagSelectionEvent {
  id: string;
  selected: boolean;
  updatePath: boolean;
}
