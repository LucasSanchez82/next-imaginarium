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

export type getEnfant = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string | null;
  email: string | null;
  dateNaissance: Date;
  idReferent: string;
  edtSemaine: {
    id: string;
  }[];
  referent: {
    email: string;
  };
  _count: {
    document: number;
    edtSemaine: number;
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
    _count: { select: { document: true; edtSemaine: true } };
    referent: {
      select: {
        email: true;
      };
    };
    edtSemaine: {
      select: { id: true };
    };
  };
};
