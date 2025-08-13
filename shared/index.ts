export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  links: ILink[];
}

export interface ILink {
  _id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  createdBy: IUser;
  createdAt: Date;
  updatedAt: Date;
  clicks: number;
}
