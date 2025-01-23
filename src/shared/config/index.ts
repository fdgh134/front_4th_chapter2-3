export const CONFIG = {
  API: {
    BASE_URL: "/api",
    TIMEOUT: 5000,
    RETRY_COUNT: 3,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 30, 50],
    MAX_PAGE_NUMBERS: 5,
  },
  STORAGE: {
    AUTH_TOKEN: "auth_token",
    USER_SETTINGS: "user_settings",
    THEME: "theme",
  }
} as const;