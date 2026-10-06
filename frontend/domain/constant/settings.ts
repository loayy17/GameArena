const SETTING_COOKIE = {
    locale: "locale",
    theme: "theme",
} as const;

const SETTING_STORAGE_KEY = {
    locale: "locale",
    theme: "theme",
    botDifficulty: "botDifficulty",
} as const;

const COOKIE_MAX_AGE = 31536000;

export { COOKIE_MAX_AGE, SETTING_COOKIE, SETTING_STORAGE_KEY };

