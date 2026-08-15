import { Role, UserStatus } from "../../generated/prisma/enums";

export interface IRequestUser {
  userId: string;
  name?: string;
  email: string;
  role: Role;
  status?: UserStatus;
  isDeleted?: boolean;
}
