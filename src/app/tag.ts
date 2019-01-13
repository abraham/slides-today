import { Color } from './color';

export interface TagData {
  id: string;
  primaryColor: Color;
  complementaryColor: Color;
}

export interface Tag extends TagData {
  selected: boolean;
}

export interface TagSelectionEvent {
  id: string;
  selected: boolean;
}
