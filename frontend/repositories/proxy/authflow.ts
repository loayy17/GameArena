export type AuthFlow = {
  email?: string;
  register?: {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
  };
};

const KEY = "auth_flow";

export const authFlow = {
  get(): AuthFlow {
    if (typeof window === "undefined") return {};
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  },

  set(data: Partial<AuthFlow>) {
    const current = authFlow.get();
    sessionStorage.setItem(KEY, JSON.stringify({ ...current, ...data }));
  },

  clear() {
    sessionStorage.removeItem(KEY);
  },
};
