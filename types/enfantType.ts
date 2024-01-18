import { Enfant } from "@prisma/client";

export type addEnfantType = {
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  dateNaissance: string;
};

export type enfantType = {
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  dateNaissance: Date;
};

export type getEnfant = Enfant & {
  referent: {
    email: string;
  };
  _count: {
    document: number;
  };
};

export type configRequestEnfantPrismaType = {
  select: {
    id: true;
    dateNaissance: true;
    idReferent: true;
    email: true;
    telephone: true;
    nom: true;
    prenom: true;
    _count: { select: { document: true } };
    referent: {
      select: {
        email: true;
      };
    };
  };
};
