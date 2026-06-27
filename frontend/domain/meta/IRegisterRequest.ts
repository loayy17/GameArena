import type { TNullable } from "@/types";

interface IRegisterRequest {
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  userName: TNullable<string>;
  email: TNullable<string>;
  password: TNullable<string>;
}
export type { IRegisterRequest };
