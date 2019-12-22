export interface Tag {
  id: string;
  primaryColor: string;
  complementaryColor: string;
}

export interface TagSelectionEvent {
  id: string;
  selected: boolean;
  updatePath: boolean;
}
