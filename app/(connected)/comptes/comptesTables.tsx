"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { DeleteDialog } from "./deleteDialog";

export function TableCompte({ comptes }: { comptes: User[] }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>nom</TableHead>
          <TableHead>email</TableHead>
          <TableHead>admin</TableHead>
          <TableHead>vérifié</TableHead>
          <TableHead>cree le</TableHead>
          <TableHead>mis a jour le</TableHead>
          <TableHead>Supprimer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comptes.map((compte, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{compte.name}</TableCell>
              <TableCell>{compte.email}</TableCell>
              <TableCell>{compte.isAdmin ? "✅" : "❌"}</TableCell>
              <TableCell>{compte.isVerified ? "✅" : "❌"}</TableCell>
              <TableCell>{compte.createdAt.toLocaleString()}</TableCell>
              <TableCell>{compte.updatedAt?.toLocaleString()}</TableCell>
              <TableCell>
                <DeleteDialog id={compte.id} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
