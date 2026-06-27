import type { TNullable } from "@/types";

interface ILoginRequest {
  email: TNullable<string>;
  password: TNullable<string>;
}
export type { ILoginRequest };
