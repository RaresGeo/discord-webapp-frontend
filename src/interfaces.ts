export interface IGuild {
  icon: string;
  id: string;
  name: string;
  owner: boolean;
  permissions: string;
  has_bot: boolean;
  is_admin: boolean;
}

export interface IUser {
  tag: string;
  balance: Number;
  avatar: string;
}
