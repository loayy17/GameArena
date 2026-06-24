import { cookies } from "next/headers";

export async function getLocaleFromCookie(): Promise<"en" | "ar"> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale");
  return locale?.value === "ar" ? "ar" : "en";
}
