import type { IUserSummary } from "@/domain/meta/IUserSummary";

function buildFullName(first: string | null | undefined, last: string | null | undefined): string {
  return `${first ?? ""} ${last ?? ""}`.trim();
}

function withFullName<T extends IUserSummary>(user: T): T {
  if (user.fullName) return user;
  return {
    ...user,
    fullName: buildFullName(user.firstName, user.lastName) || user.userName || user.id,
  };
}

type TSearchableUser = Pick<IUserSummary, "firstName" | "lastName" | "userName" | "fullName">;

function filterUsersByTerm<T extends TSearchableUser>(users: T[], term: string): T[] {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return users;
  return users.filter((u) => {
    const haystack = `${u.fullName ?? ""} ${u.firstName ?? ""} ${u.lastName ?? ""} ${u.userName ?? ""}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export { buildFullName, filterUsersByTerm, withFullName };
