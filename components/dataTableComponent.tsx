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
import { useState } from "react";
import { deleteEnfantServer } from "./actions/enfant";
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
  const [limit, setLimit] = useState(initialLimit);
  const [nbPages, setNbPages] = useState(initialNbPages);
  const {toast} = useToast();

  return (
    <>
      <DialogAddEnfantForm/>
      <SearchBar
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
            {enfants.map((enfant) => (
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
