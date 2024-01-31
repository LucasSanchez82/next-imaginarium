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
import { deleteEnfantServer, getSpecificEnfants } from "./actions/enfant";
import { Button } from "./ui/button";
import { SubmitButton } from "./submitButton";
import { useToast } from "./ui/use-toast";

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
  const {toast} = useToast();

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
            <TableHead>Supprimer</TableHead>
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
                    calendrier
                  </Link>
                </TableCell>
                <TableCell>
                  <form action={async () => {
                    try{
                      const deletedEnfant = await deleteEnfantServer(enfant.id);
                      toast({
                        variant: "default",
                        title: deletedEnfant || "Enfant supprime",
                      })
                      reloadVisibleEnfants();
                    }catch(e){
                      toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: e ? String(e) : "Erreur serveur",
                      })
                    }
                  }}>
                    <SubmitButton>
                      Supprimer
                    </SubmitButton>
                  </form>
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
