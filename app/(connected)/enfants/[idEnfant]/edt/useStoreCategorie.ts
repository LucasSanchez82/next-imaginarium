import { create } from "zustand";
import { CategorieUsedEventWithoutExtendedProps } from "./categoryUsedEvent";


export const useStoreCategorie = create<{
  categorie: CategorieUsedEventWithoutExtendedProps | null;
  setCategorie: (categorie: CategorieUsedEventWithoutExtendedProps | null) => void;
}>((set, get) => ({
  categorie: null,
  setCategorie(categorie) {
    set({ categorie });
  },
}));
