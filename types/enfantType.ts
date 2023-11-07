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