export type registerType = {
  name: string;
  email: string;
  password: string;
};

export type loginType = {
  email: string;
  password: string;
};

export type sessionType = {
  id: string; //obliger de mettre id
  email: string;
  name: string;
  isAdmin: boolean;
  isVerified: boolean;
};
