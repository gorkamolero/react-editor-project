export const isDevBuild = process.env.NODE_ENV === "development";
export const isClient = typeof window !== "undefined";
