interface IUserPreferences {
  locale: "en" | "ar";
  theme: "light" | "dark";
  soundEnabled: boolean;
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  showGameActivity: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const DEFAULT_USER_PREFERENCES: IUserPreferences = {
  locale: "en",
  theme: "dark",
  soundEnabled: true,
  showOnlineStatus: true,
  allowFriendRequests: true,
  showGameActivity: true,
  emailNotifications: true,
  pushNotifications: true,
};

export type { IUserPreferences };
export { DEFAULT_USER_PREFERENCES };
