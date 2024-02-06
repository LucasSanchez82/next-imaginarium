"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { DeleteDialog } from "./deleteDialog";
import { EditEnfantFormDialog } from "./editCompteDialog";
import { useState } from "react";

export function TableCompte({ comptes }: { comptes: User[] }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Admin</TableHead>
          <TableHead>Vérifié</TableHead>
          <TableHead>Cree le</TableHead>
          <TableHead>Mis à jour le</TableHead>
          <TableHead>Supprimer</TableHead>
          <TableHead>Modifier</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comptes.map((compte, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{compte.name}</TableCell>
              <TableCell>{compte.email}</TableCell>
              <TableCell>{compte.isAdmin ? "🟢" : "🔴"}</TableCell>
              <TableCell>{compte.isVerified ? "🟢" : "🔴"}</TableCell>
              <TableCell>{compte.createdAt.toLocaleString()}</TableCell>
              <TableCell>{compte.updatedAt?.toLocaleString()}</TableCell>
              <TableCell>
                <DeleteDialog
                  id={compte.id}
                />
              </TableCell>
              <TableCell>
                <EditEnfantFormDialog
                  compte={compte}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
