export interface IAuthUser {
  _id: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: IAuthUser;
}
