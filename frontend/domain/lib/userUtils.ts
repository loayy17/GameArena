import type { IUserSummary } from "@/domain/meta/IUserSummary";

type TSearchableUser = Pick<IUserSummary, "firstName" | "lastName" | "userName" | "fullName">;

function filterUsersByTerm<T extends TSearchableUser>(users: T[], term: string): T[] {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return users;
  return users.filter((u) => {
    const haystack = `${u.fullName ?? ""} ${u.firstName ?? ""} ${u.lastName ?? ""} ${u.userName ?? ""}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export { filterUsersByTerm };
