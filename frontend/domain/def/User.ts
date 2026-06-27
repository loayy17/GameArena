import { EMPTY_GUID, TNullable } from "@/types";
import { UserRoleEnum } from "../enum/UserRoleEnum";
import { IUser } from "../meta/IUser";
import { UserStatusEnum } from "../enum/UserStatusEnum";

class User implements IUser {
  id: string;
  userName: TNullable<string>;
  email: TNullable<string>;
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  role: UserRoleEnum;
  status: UserStatusEnum;
  createdAt: Date;
  isVerified: boolean;
  fullName: TNullable<string>;
  constructor(
    id = EMPTY_GUID,
    userName = null,
    email = null,
    firstName = null,
    lastName = null,
    role = UserRoleEnum.None,
    status = UserStatusEnum.Offline,
    createdAt = new Date(),
    isVerified = false,
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.isVerified = isVerified;
    this.fullName = `${firstName} ${lastName}`;
  }
}

export { User };
