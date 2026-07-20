const en = {
  title: "Settings",
  settings: {
    profile: {
      title: "Profile",
      subtitle: "Manage your personal information and account settings",
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
      subtitle: "Update your password to keep your account secure",
      oldPassword: "Old Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      save: "Update Password",
      saved: "Password changed successfully",
      invalidCurrentPassword: "Invalid current password",
    },
    preferences: {
      title: "Preferences",
      subtitle: "Customize your GameArena experience",
      save: "Save Preferences",
      saved: "Preferences saved",
      theme: "Dark Theme",
      darkMode: "Dark Mode",
      language: "Language",
      sound: "Sound Effects",
      showOnline: "Show Online Status",
      showGameActivity: "Show Game Activity",
      showNotifications: "Show Notifications",
      branding: "Custom Branding Colors",
      primaryColor: "Primary Color",
      secondaryColor: "Secondary Color",
      backgroundColor: "Background",
      bgPlaceholder: "Default",
    },
  },
};

type TSettingsTranslation = typeof en;

export { en, type TSettingsTranslation };
