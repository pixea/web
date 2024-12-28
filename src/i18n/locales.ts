export const locales = ["en", "sk"] as const;

export type Locales = (typeof locales)[number];
