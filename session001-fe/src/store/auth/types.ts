export interface IUser {
  id: number;
  name: string;
  email: string;
  role_id?: any | null;
}

export interface IAccessToken {
  exp: number;
}
