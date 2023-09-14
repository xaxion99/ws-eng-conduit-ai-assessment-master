export interface IUserData {
  bio: string;
  email: string;
  image?: string;
  token?: string; // Made token optional
  username: string;
}

export interface IUserRO {
  user: IUserData;
}
