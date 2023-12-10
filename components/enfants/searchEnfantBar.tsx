"use client";
import { getEnfant } from "@/types/enfantType";
import { Dispatch, SetStateAction, SyntheticEvent, useEffect } from "react";

const SearchBar = ({
  useEnfant,
  useLoading,
  reloadVisibleEnfants,
  useNbPages,
}: {
  reloadVisibleEnfants: (refreshNbPages: boolean) => Promise<void>;
  useEnfant: {
    searchEnfant: string;
    setSearchEnfant: Dispatch<SetStateAction<string>>;
  };
  useLoading: {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  };
  useNbPages: {
    nbPages: number;
    setNbPages: Dispatch<SetStateAction<number>>;
  };
}) => {
  const { setSearchEnfant } = useEnfant;
  const { isLoading } = useLoading;
  const { setNbPages } = useNbPages;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    reloadVisibleEnfants(true); // true pour actualiser le nombres de pages possibles
  };
  return (
    <form onSubmit={handleSubmit} className="flex justify-around items-center">
      <input
        type="search"
        placeholder="chercher un enfant..."
        name="searchEnfant"
        className="bg-secondary rounded p-1"
        onChange={(event) => setSearchEnfant(event.target.value)}
      />
      <input
        type="submit"
        disabled={isLoading}
        value={isLoading ? "Chargement" : "Rechercher"}
        className="disabled:bg-secondary disabled:text-primary bg-primary text-secondary rounded cursor-pointer p-1"
      />
    </form>
  );
};

export default SearchBar;
