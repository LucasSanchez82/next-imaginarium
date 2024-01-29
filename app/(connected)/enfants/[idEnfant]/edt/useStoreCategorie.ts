import { create } from 'zustand';
import {CategorieUsedEvent} from './categoryUsedEvent'
export const useStoreCategorie = create((set, get): {
  categorie: CategorieUsedEvent | null;
  setCategorie: (categorie: CategorieUsedEvent) => void;
} => ({
  categorie: null,
  setCategorie(categorie) {
    set({ categorie });
  },
}));