import { Note } from '../interfaces/Note';

export const utils = {
  getNotes: () => localStorage.getItem('notes'),
  setNotes: (notes: Note[]) => localStorage.setItem('notes', JSON.stringify(notes)),
};
