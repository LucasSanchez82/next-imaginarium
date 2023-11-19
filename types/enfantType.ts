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
};
