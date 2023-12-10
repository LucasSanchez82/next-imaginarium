"use client";
import { DialogAddEnfantForm } from "@/components/enfants/dialogAddEnfantForm";
import PreviousNextBar from "@/components/enfants/previousNextBar";
import SearchBar from "@/components/enfants/searchEnfantBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { configRequestEnfantPrismaType, getEnfant } from "@/types/enfantType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSpecificEnfants } from "./actions/enfant";

export function TableEnfant({
  enfants,
  limit: initialLimit,
  nbPages: initialNbPages,
  configRequestPrisma,
}: {
  enfants: getEnfant[];
  limit: { skip: number; take: number };
  nbPages: number;
  configRequestPrisma: configRequestEnfantPrismaType;
}) {
  const [newEnfants, setNewEnfants] = useState<getEnfant[]>(enfants);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState(initialLimit);
  const [nbPages, setNbPages] = useState(initialNbPages);
  const [searchEnfant, setSearchEnfant] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const reloadVisibleEnfants = async (refreshNbPages = false) => {
    //s'occupe d'actualiser le tableau d'enfants

    setIsLoading(true);
    const { enfants, nbPages } = (await getSpecificEnfants(
      String(searchEnfant),
      limit,
      refreshNbPages,
      configRequestPrisma
    )) as  // mauvais pratique mais pour le coup on est sur d'etre authentifie et sinon c'est complique pour rien a gerer
      | {
          enfants: getEnfant[];
          nbPages: number;
        }
      | {
          enfants: getEnfant[];
          nbPages?: undefined;
        };

    if (nbPages) setNbPages(nbPages);
    setNewEnfants(enfants);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isMounted) {
      //ca ne sert a rien de le lancer au chargement
      console.log("lancement du useeffect");
      reloadVisibleEnfants();
    } else {
      setIsMounted(true);
    }
  }, [limit]);

  return (
    <>
      <DialogAddEnfantForm reloadVisibleEnfants={reloadVisibleEnfants} />
      <SearchBar
        useEnfant={{ searchEnfant, setSearchEnfant }}
        useLoading={{ isLoading, setIsLoading }}
        reloadVisibleEnfants={reloadVisibleEnfants}
        useNbPages={{ nbPages, setNbPages }}
      />
      <Table>
        <TableCaption>Liste des enfants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>nom</TableHead>
            <TableHead>prenom</TableHead>
            <TableHead>telephone</TableHead>
            <TableHead>email</TableHead>
            <TableHead>dateNaissance</TableHead>
            <TableHead>documents</TableHead>
            <TableHead>referent</TableHead>
            <TableHead>emploi du temps</TableHead>
          </TableRow>
        </TableHeader>
        {
          <TableBody>
            {newEnfants.map((enfant) => (
              <TableRow key={enfant.id}>
                <TableCell>{enfant.nom}</TableCell>
                <TableCell>{enfant.prenom}</TableCell>
                <TableCell>{enfant.telephone}</TableCell>
                <TableCell>{enfant.email}</TableCell>
                <TableCell>{enfant.dateNaissance.getFullYear()}</TableCell>
                <TableCell>
                  <Link
                    className="underline rounded p-1 bg-secondary"
                    href={"/enfants/" + enfant.id + "/dossier"}
                  >
                    dossier({enfant._count.document})
                  </Link>
                </TableCell>
                <TableCell>{enfant.referent.email}</TableCell>
                <TableCell>
                  <Link
                    className="underline rounded p-1 bg-secondary"
                    href={"/enfants/" + enfant.id + "/edt"}
                  >
                    Semaines({enfant._count.edtSemaine})
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            <PreviousNextBar
              setLimit={setLimit}
              colSpan={8}
              limit={limit}
              nbPages={nbPages}
            />
          </TableBody>
        }
      </Table>
    </>
  );
}
