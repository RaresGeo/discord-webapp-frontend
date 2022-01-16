export interface IGuild {
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: string;
}

export interface IUser {
  tag: string;
  balance: Number;
  avatar: string;
}
