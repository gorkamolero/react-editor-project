import { Extension } from "@tiptap/core";

export interface KVStorageOptions {}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {}
}

export const KVStorage = Extension.create<KVStorageOptions>({
  name: "kvStorage",

  addStorage() {
    return {
      headNumbering: undefined,
      tailNumbering: undefined,
    };
  },

  addCommands() {
    return {};
  },
});
