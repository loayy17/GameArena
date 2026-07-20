interface IUserPreferences {
  locale: "en" | "ar";
  theme: "light" | "dark";
  soundEnabled: boolean;
  showOnlineStatus: boolean;
  showGameActivity: boolean;
  showNotifications: boolean;
}

const DEFAULT_USER_PREFERENCES: IUserPreferences = {
  locale: "en",
  theme: "dark",
  soundEnabled: true,
  showOnlineStatus: true,
  showGameActivity: true,
  showNotifications: true,
};

export type { IUserPreferences };
export { DEFAULT_USER_PREFERENCES };
