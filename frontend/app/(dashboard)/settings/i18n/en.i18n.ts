const en = {
  title: "Settings",
  settings: {
    profile: {
      title: "Profile",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      email: "Email",
      save: "Save Changes",
      saved: "Profile updated successfully",
      linkedAccounts: "Linked Accounts",
      connected: "Connected",
      notConnected: "Not connected",
      discord: "Discord",
      google: "Google",
      twitch: "Twitch",
    },
    password: {
      title: "Change Password",
      oldPassword: "Old Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      save: "Update Password",
      saved: "Password changed successfully",
    },
    preferences: {
      title: "Preferences",
      save: "Save Preferences",
      saved: "Preferences saved",
      theme: "Dark Theme",
      sound: "Sound Effects",
      showOnline: "Show Online Status",
      allowFriendRequests: "Allow Friend Requests",
      showGameActivity: "Show Game Activity",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
    },
  },
};

type TSettingsTranslation = typeof en;

export { en, type TSettingsTranslation };
