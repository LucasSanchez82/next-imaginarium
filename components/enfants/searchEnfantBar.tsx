"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent, useCallback } from "react";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const searchStr =
      event.target instanceof HTMLFormElement &&
      new FormData(event.target).get("searchEnfant")?.toString();
    router.push(
      pathname + "?" + createQueryString("searchEnfant", searchStr || "")
    );
  };
  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center">
      <input
        type="search"
        placeholder="chercher un enfant..."
        name="searchEnfant"
        className="bg-secondary rounded p-1 mr-2"
        autoFocus
      />
      <input
        type="submit"
        // disabled={isLoading}
        value={"Rechercher"}
        className="disabled:bg-secondary disabled:text-primary bg-primary text-secondary rounded cursor-pointer p-1 ml-2"
      />
    </form>
  );
};

export default SearchBar;
